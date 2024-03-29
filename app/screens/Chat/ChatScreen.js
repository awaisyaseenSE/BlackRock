import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  Platform,
  PermissionsAndroid,
  StatusBar,
} from 'react-native';
import React, {useEffect, useState, useCallback, useRef} from 'react';
import ScreenComponent from '../../components/ScreenComponent';
import colors from '../../styles/colors';
import FastImage from 'react-native-fast-image';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import MyIndicatorLoader from '../../components/MyIndicatorLoader';
import fontFamily from '../../styles/fontFamily';
import {useNavigation} from '@react-navigation/native';
import SoundRecorder from 'react-native-sound-recorder';
import SoundPlayer from 'react-native-sound-player';
import BackgroundTimer from 'react-native-background-timer';
import TopChatComponent from './components/TopChatComponent';
import AddNewMessageCompo from './components/AddNewMessageCompo';
import AttachmentComponent from './components/AttachmentComponent';
import DocumentPicker from 'react-native-document-picker';
import ShowMessagesComponent from './components/ShowMessagesComponent';
import ShowDateMessagesCompo from './components/ShowDateMessagesCompo';

export default function ChatScreen({route}) {
  const routeData = route?.params;
  const currentUserUid = auth()?.currentUser?.uid;
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [receiverData, setReceiverData] = useState(null);
  const [receiverName, setReceiverName] = useState('');
  const [newTextMessage, setNewTextMessage] = useState('');
  const [sendShow, setSendShow] = useState(false);
  const [recordingModal, setRecordingModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replyId, setReplyId] = useState('');
  const [replyUserUid, setReplyUserUid] = useState('');
  const [replyMessageType, setReplyMessageType] = useState('');
  const [selectAttachment, setSelectAttachment] = useState(false);
  const [selectedImageData, setSelectedImageData] = useState(null);

  var isMounted = false;

  useEffect(() => {
    isMounted = true;
    getChatMessage();
    getUserData();
    return () => {
      isMounted = false;
    };
  }, []);

  const getChatMessage = () => {
    try {
      setLoading(true);
      firestore()
        .collection('chats')
        .doc(routeData.chatID)
        .collection('messages')
        .orderBy('time', 'asc')
        .onSnapshot(snapshot => {
          const newMessages = snapshot.docs.map(doc => ({
            ...doc.data(),
            _id: doc.id,
            isPlaying: false,
            time: doc.data().time.toDate(),
          }));
          console.log('new messages is: ', newMessages);
          formatMessages(newMessages);
          setLoading(false);
        });
    } catch (error) {
      setLoading(false);
      console.log(
        "error while fetching chat message's from firestore in chat screen: ",
        error,
      );
    }
  };

  const getUserData = () => {
    try {
      setLoading(true);
      var separate = routeData.chatID.split('&');
      var id1 = separate[0];
      var id2 = separate[1];
      var receiverID = '';
      if (id1 !== currentUserUid) {
        receiverID = id1;
      } else {
        receiverID = id2;
      }

      firestore()
        .collection('users')
        .doc(receiverID)
        .onSnapshot(documentSnapshot => {
          if (documentSnapshot.exists) {
            var doc = documentSnapshot.data();
            setReceiverData({...doc, id: documentSnapshot.id});
            setReceiverName(doc?.fullName);
            setLoading(false);
          } else {
            setLoading(false);
          }
        });
    } catch (error) {
      setLoading(false);
      console.log(
        "error while fetching receiver data for chat message's in chat screen: ",
        error,
      );
    }
  };

  // Function to check if two dates are the same day
  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const formatMessages = messages => {
    const formattedList = [];
    let currentDate = null;
    messages.forEach(message => {
      const messageDate = message.time;
      if (!currentDate || !isSameDay(currentDate, messageDate)) {
        formattedList.push({
          id: `separator_${message._id}`,
          isSeparator: true,
          date: messageDate,
        });
        currentDate = messageDate;
      }
      formattedList.push(message);
    });
    setMessages(formattedList);
  };

  const sendMessage = () => {};

  const handlePickImage = () => {};

  const captureImage = async () => {
    // try {
    //   setLoading(true);
    //   // const value = await askingPermission.requestPermissionn();
    //   const value = true;
    //   if (value) {
    //     const options = {
    //       title: 'Click Photo or Record Video',
    //       storageOptions: {
    //         skipBackup: true,
    //         path: 'images',
    //       },
    //       mediaType: 'mixed',
    //     };
    //     launchCamera(options, response => {
    //       if (response.didCancel) {
    //         console.log('User cancelled image picker');
    //         setLoading(false);
    //       } else if (response.error) {
    //         console.log('ImagePicker Error: ', response.error);
    //         setLoading(false);
    //       } else {
    //         let mediaUri = response.uri || response.assets?.[0]?.uri;
    //         let mediaType = response.assets?.[0]?.type;
    //         setSelectedMedia(mediaUri);
    //         setSelectedMediaType(mediaType);
    //         setLoading(false);
    //         if (
    //           mediaUri !== undefined &&
    //           mediaUri !== null &&
    //           mediaUri !== ''
    //         ) {
    //           setShowMediaModal(true);
    //         }
    //       }
    //     });
    //   }
    // } catch (error) {
    //   console.log('error while opening camera in group chat screen: ', error);
    // }
  };

  const closeReply = () => {
    setReplyId('');
    setReplyText('');
    setReplyMessageType('');
    setReplyUserUid('');
  };

  const handleDocumentSelection = useCallback(async () => {
    try {
      // console.log('handle document selection is called');
      const response = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
        type: [DocumentPicker.types.allFiles],
      });
      if (!!response) {
        setSelectedImageData(null);
        setSelectAttachment(false);
        //   confirmAndSendMesssage(response.uri, response.name);
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <>
      <ScreenComponent style={{backgroundColor: colors.moviesBg}}>
        {selectAttachmentFunction()}
        <TopChatComponent userData={receiverData} chatID={routeData.chatID} />
        <View style={styles.container}>
          <FlatList
            inverted={true}
            data={[...messages].reverse()}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => {
              if (!item.isSeparator) {
                return (
                  <ShowMessagesComponent
                    item={item}
                    startPlaying={() => {
                      startPlaying(item);
                    }}
                    stopPlaying={() => stopPlaying(item)}
                    swipeToReply={swipeToReply}
                    closeReply={closeReply}
                  />
                );
              } else {
                return <ShowDateMessagesCompo date={item.date} />;
              }
            }}
            ItemSeparatorComponent={<View style={{marginVertical: 8}} />}
          />
        </View>
        <AddNewMessageCompo
          setNewTextMessage={setNewTextMessage}
          newTextMessage={newTextMessage}
          sendShow={sendShow}
          setSendShow={setSendShow}
          sendMessage={sendMessage}
          setRecordingModal={setRecordingModal}
          captureImage={captureImage}
          replyText={replyText}
          replyUserUid={replyUserUid}
          closeReply={closeReply}
          replyMessageType={replyMessageType}
          receiverName={receiverName}
          setSelectAttachment={setSelectAttachment}
        />
      </ScreenComponent>
      <MyIndicatorLoader visible={loading} />
    </>
  );

  function selectAttachmentFunction() {
    return (
      <Modal
        visible={selectAttachment}
        animationType="slide"
        transparent={true}
        style={{flex: 1}}>
        <AttachmentComponent
          onPressCancel={() => setSelectAttachment(false)}
          onPressPickImage={() => {
            handlePickImage();
          }}
          onPressPickDocument={() => {
            handleDocumentSelection();
          }}
          onPressPickAudio={() => {
            // handleAudioSelection();
            // setSelectAttachment(false);
          }}
        />
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.chatBg,
  },
});
