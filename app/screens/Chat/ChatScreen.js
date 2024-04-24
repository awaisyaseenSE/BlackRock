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
  Alert,
  TextInput,
  Linking,
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
import firebase from '@react-native-firebase/app';
import {pickImage} from '../../helper/mediaPicker';
import RecordingComponent from './components/RecordingComponent';
import {launchCamera} from 'react-native-image-picker';
import {PERMISSIONS, request} from 'react-native-permissions';

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
  const [selectedMedia, setSelectedMedia] = useState('');
  const [selectedMediaType, setSelectedMediaType] = useState('');
  const [captionText, setCaptionText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  // below for adding caption in image
  const [selectedImage, setSelectedImage] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);

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

  const uriToBlob = uri => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        // return the blob
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new Error('uriToBlob failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);

      xhr.send(null);
    });
  };

  const confirmAndSendMesssage = async (filePath, extraText, ifAudio) => {
    setLoading(true);
    let mediaType = '';
    let finalFilePath = '';
    if (!!filePath && !!extraText && !ifAudio) {
      let id = Date.now();
      finalFilePath = 'chatMedia/' + `media_${id}${extraText}`;
      if (
        extraText == '.jpg' ||
        extraText == '.jpeg' ||
        extraText == '.heic' ||
        extraText == '.png' ||
        extraText == '.svg' ||
        extraText == '.gif' ||
        extraText == '.jfif' ||
        extraText == '.pjpeg' ||
        extraText == '.pjp'
      ) {
        mediaType = 'image';
      } else if (extraText == '.mp4') {
        mediaType = 'video';
      } else {
        let ff = extraText.split('.')[1];
        mediaType = 'file/' + ff;
      }
    } else if (ifAudio) {
      // Alert.alert('audio');
      console.log('audio filePath is: ', filePath);
      let id = Date.now();
      finalFilePath = 'chatMedia/' + `media_Voice_${id}.mp3`;
    } else {
      Alert.alert('please select any file');
      return;
    }

    try {
      let bloabMedia;
      if (!ifAudio) {
        let res = await uriToBlob(filePath);
        bloabMedia = res;
      }
      const snapshot = storage().ref(finalFilePath);

      ifAudio
        ? await snapshot.putFile(filePath)
        : await snapshot.put(bloabMedia);
      const url = await storage().ref(finalFilePath).getDownloadURL();
      if (!ifAudio) {
        // setSelectedMedia(url);
        // console.log('Url of file that uplaod to firebase storage is: ', url);
      } else {
        // console.log('uploaded file url is     ', url);
      }
      setLoading(false);
      if (!ifAudio) {
        sendMessage(url, mediaType, captionText, false);
      } else {
        sendMessage(url, 'file', extraText, ifAudio);
      }
    } catch (error) {
      console.log('uploading image error => ', error);
      setLoading(false);
    }
  };

  const sendMessage = (txt, type, extraText, ifAudio) => {
    setLoading(true);
    if (type !== 'text') {
    }

    setNewTextMessage('');
    if (extraText === undefined) {
      extraText = '';
    }
    if (ifAudio === true) {
      type = 'audio';
    }

    var lastSendMessage = '';
    var idForMessagesCollection = firestore()
      .collection('chats')
      .doc(routeData.chatID)
      .collection('messages')
      .doc().id;

    lastSendMessage = txt;

    var allIDs = routeData.chatID.split('&');
    var senderID = '';
    var receiverID = '';
    if (allIDs[0] === currentUserUid) {
      senderID = allIDs[0];
      receiverID = allIDs[1];
    } else {
      senderID = allIDs[1];
      receiverID = allIDs[0];
    }

    firestore()
      .collection('chats')
      .doc(routeData.chatID)
      .set(
        {
          lastMessage: lastSendMessage,
          messageTime: new Date(),
          type: type,
          from_message_num: firebase.firestore.FieldValue.increment(1),
        },
        {merge: true},
      );

    var chatData;

    if (replyId !== '') {
      chatData = {
        message: lastSendMessage,
        time: new Date(),
        senderID: senderID,
        receiverID: receiverID,
        chatID: routeData.chatID,
        isRead: false,
        type: type,
        extraText: extraText,
        replyId: replyId,
      };
    } else {
      chatData = {
        message: lastSendMessage,
        time: new Date(),
        senderID: senderID,
        receiverID: receiverID,
        chatID: routeData.chatID,
        isRead: false,
        type: type,
        extraText: extraText,
      };
    }

    firestore()
      .collection('chats')
      .doc(routeData.chatID)
      .collection('messages')
      .doc(idForMessagesCollection)
      .set(chatData, {merge: true})
      .then(() => {
        setLoading(false);
        setNewTextMessage('');
        setSendShow(false);
        setSelectedImageData(null);
        setSelectAttachment(false);
        setCaptionText('');
        closeReply();
        setShowImageModal(false);
        setSelectedMedia('');
        setSelectedMediaType('');
      })
      .catch(err => {
        setLoading(false);
        console.log('Error in uploading messages: ', err);
      });
  };

  const handlePickImage = async () => {
    try {
      let res = await pickImage();
      if (!!res) {
        let checkVideoOrImg = res?.type?.split('/')[0];
        if (checkVideoOrImg == 'video') {
          let ext = res?.type?.split('/')[1];
          let finalExt = `.${ext}`;
          confirmAndSendMesssage(res?.uri, finalExt, false);
        } else if (checkVideoOrImg == 'image') {
          let ext = res?.type?.split('/')[1];
          let finalExt = `.${ext}`;
          // confirmAndSendMesssage(res?.uri, finalExt, false);
          setSelectAttachment(false);
          setSelectedMedia(res?.uri);
          setSelectedMediaType(finalExt);
          // setShowImageModal(true);
          setTimeout(() => {
            setShowImageModal(true);
            setLoading(false);
          }, 1000);
        } else {
          return null;
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const captureImage = async () => {
    if (Platform.OS == 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'CAMERA Permission Required',
          message: 'App needs access to your camera to take picture!',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('camera permission is granted');
      } else {
        Alert.alert(
          'Camera Permission Required!',
          'Please enable camera permission to take picture.',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'Enable',
              onPress: () => {
                Linking.openSettings();
              },
            },
          ],
        );
        return null;
      }
    }

    if (Platform.OS === 'ios') {
      let cameraIosPermission = await request(PERMISSIONS.IOS.CAMERA);
      if (cameraIosPermission == 'granted') {
        console.log('permission is ', cameraIosPermission);
      } else {
        return null;
      }
    }

    try {
      setLoading(true);
      const value = true;
      if (value) {
        const options = {
          title: 'Click Photo or Record Video',
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
          mediaType: 'mixed',
        };
        launchCamera(options, response => {
          if (response.didCancel) {
            console.log('User cancelled image picker');
            setLoading(false);
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
            setLoading(false);
          } else {
            let mediaUri = response.uri || response.assets?.[0]?.uri;
            let mediaType = response.assets?.[0]?.type;
            let ext = mediaType?.split('/')[1];
            let finalExt = `.${ext}`;
            setSelectedMedia(mediaUri);
            setSelectedMediaType(finalExt);
            setLoading(false);
            if (
              mediaUri !== undefined &&
              mediaUri !== null &&
              mediaUri !== ''
            ) {
              setShowImageModal(true);
            }
          }
        });
      }
    } catch (error) {
      setLoading(false);
      console.log('error while opening camera in group chat screen: ', error);
    }
  };

  const closeReply = () => {
    setReplyId('');
    setReplyText('');
    setReplyMessageType('');
    setReplyUserUid('');
  };

  const requestStoragePermission = async () => {
    if (Platform.OS === 'ios') {
      return true;
    }
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to your storage to upload files.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Storage permission granted');
        return true;
      } else {
        console.log('Storage permission denied');
        return false;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const handleDocumentSelection = async () => {
    let res = await requestStoragePermission();
    if (!res) {
      return Alert.alert('storage permission denie');
    }

    try {
      const response = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
        type: [
          DocumentPicker.types.csv,
          DocumentPicker.types.doc,
          DocumentPicker.types.pdf,
          DocumentPicker.types.plainText,
          DocumentPicker.types.pptx,
          DocumentPicker.types.xls,
          DocumentPicker.types.images,
          DocumentPicker.types.zip,
          DocumentPicker.types.video,
          DocumentPicker.types.audio,
          DocumentPicker.types.ppt,
          DocumentPicker.types.docx,
          DocumentPicker.types.xlsx,
        ],
        copyTo:
          Platform.OS === 'android' ? 'cachesDirectory' : 'documentDirectory',
      });
      if (!!response) {
        const fileSizeInBytes = response.size;
        const fileSizeInMB = fileSizeInBytes / (1024 * 1024); // Convert bytes to MB
        if (fileSizeInMB > 5) {
          Alert.alert(
            'File Size Exceeded',
            'Selected file exceeds 5MB. Please select a smaller file.',
          );
          return null;
        }
        setSelectedImageData(null);
        setSelectAttachment(false);
        let resType = response?.type.split('/')[1];
        let finalType =
          resType == 'plain'
            ? '.txt'
            : resType == 'vnd.ms-excel'
            ? '.xls'
            : resType ==
              'vnd.openxmlformats-officedocument.presentationml.presentation'
            ? '.pptx'
            : resType == 'msword'
            ? '.doc'
            : resType == 'vnd.ms-powerpoint'
            ? '.ppt'
            : resType ==
              'vnd.openxmlformats-officedocument.wordprocessingml.document'
            ? '.docx'
            : resType == 'vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            ? '.xlsx'
            : resType == 'svg+xml'
            ? '.svg'
            : `.${resType}`;
        // console.log('final type in document picker : ', finalType);
        confirmAndSendMesssage(response?.fileCopyUri, finalType, false);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('user cencel document picker!');
      } else {
        console.log('Error selecting file:', err);
      }
    }
  };

  const swipeToReply = itemReply => {
    let replyMessage = '';
    if (itemReply.type === 'text') {
      setReplyMessageType('text');
      replyMessage =
        itemReply.message.length > 20
          ? itemReply.message.slice(0, 20) + '...'
          : itemReply.message;
    } else if (itemReply.type === 'audio') {
      setReplyMessageType('audio');
      replyMessage = 'Reply to Vocie!';
    } else if (itemReply.type === 'image') {
      setReplyMessageType('image');
      replyMessage = 'Reply to Image!';
    } else if (itemReply.type === 'video') {
      setReplyMessageType('video');
      replyMessage = 'Reply to Video!';
    } else {
      setReplyMessageType('file');
      replyMessage = 'Reply to file';
    }
    setReplyId(itemReply._id);
    setReplyText(replyMessage);
    setReplyUserUid(itemReply.senderID);
  };

  const cencelImage = () => {
    setShowImageModal(false);
    setSelectedMedia('');
    setSelectedMediaType('');
    setLoading(false);
  };

  const onStopRecord = async () => {
    SoundRecorder.stop()
      .then(function (result) {
        var path = result.path;
        let voiceDuration = result.duration;
        // confirmAndSendMesssage(path, '', true);
        confirmAndSendMesssage(path, voiceDuration, true);
      })
      .catch(function (error) {
        console.log('error', error);
      });
  };

  const onStartRecord = async () => {
    if (Platform.OS === 'android') {
      const grants = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );

      if (grants === PermissionsAndroid.RESULTS.GRANTED) {
        SoundRecorder.start(
          SoundRecorder.PATH_CACHE + '/' + Date.now() + '.mp4',
        )
          .then(function () {})
          .catch(function (error) {
            console.log('error', error);
          });
      }
    } else {
      SoundRecorder.start(SoundRecorder.PATH_CACHE + '/' + Date.now() + '.mp4')
        .then(function () {})
        .catch(function (error) {
          console.log('error', error);
        });
    }
  };

  const startPlaying = item => {
    var temp = messages;
    temp.forEach(each => {
      if (item.message === each.message) {
        each.isPlaying = true;
      } else {
        each.isPlaying = false;
      }
    });

    setMessages([...temp]);
  };

  const stopPlaying = item => {
    var temp = messages;
    temp.forEach(each => {
      if (item.message === each.message) {
        each.isPlaying = false;
      }
    });
    setMessages([...temp]);
    SoundPlayer.stop();
    BackgroundTimer.stopBackgroundTimer();
  };

  return (
    <>
      <ScreenComponent style={{backgroundColor: colors.moviesBg}}>
        {selectAttachmentFunction()}
        {pickImageFunction()}
        {recordingModalFunction()}
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

  function pickImageFunction() {
    return (
      <Modal
        visible={showImageModal}
        animationType="slide"
        style={{flex: 1}}
        transparent={true}>
        <View style={{flex: 1, backgroundColor: 'rgba(60, 60, 60,0.1)'}}>
          <View style={{padding: 20, alignItems: 'flex-end'}}>
            <TouchableOpacity
              style={styles.closeIconContainer}
              onPress={cencelImage}>
              <Image
                source={require('../../assets/close.png')}
                style={styles.closeIcon}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
            }}>
            <View
              style={{
                backgroundColor: colors.moviesBg,
                paddingBottom: 42,
                paddingTop: 20,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
              }}>
              <View style={{alignItems: 'center'}}>
                <FastImage
                  source={{uri: selectedMedia}}
                  style={{width: '90%', height: 220, borderRadius: 6}}
                />
              </View>
              <View
                style={[
                  styles.addMessageContainer,
                  {marginTop: 12, paddingHorizontal: 20},
                ]}>
                <TextInput
                  style={styles.inputImageModal}
                  placeholder="Enter Caption here"
                  value={captionText}
                  onChangeText={text => setCaptionText(text)}
                  placeholderTextColor={colors.gray}
                />
                <TouchableOpacity
                  style={styles.plusIconContainer}
                  onPress={() =>
                    confirmAndSendMesssage(
                      selectedMedia,
                      selectedMediaType,
                      false,
                    )
                  }>
                  <Image
                    source={require('../../assets/ic_send.png')}
                    style={[styles.plusIcon, {tintColor: colors.blue}]}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <MyIndicatorLoader visible={loading} />
      </Modal>
    );
  }
  function recordingModalFunction() {
    return (
      <Modal
        visible={recordingModal}
        animationType="slide"
        transparent={true}
        style={{
          height: '100%',
          width: '100%',
        }}>
        <RecordingComponent
          onPressCancel={() => {
            SoundRecorder.stop()
              .then(function (result) {
                console.log('result', result);
              })
              .catch(function (error) {
                console.log('error', error);
              });
            setIsRecording(false);
            setRecordingModal(false);
          }}
          isRecording={isRecording}
          onPressRecord={() => {
            setIsRecording(true);
            onStartRecord();
          }}
          onPressSend={() => {
            onStopRecord();
            setIsRecording(false);
            setRecordingModal(false);
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
    paddingVertical: 6,
  },
  closeIcon: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
    tintColor: colors.LightWhite,
  },
  closeIconContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blue,
    borderRadius: 15,
    marginTop: 40,
  },
  plusIconContainer: {
    marginLeft: 10,
    paddingHorizontal: 10,
    width: 30,
    alignItems: 'flex-end',
    height: 30,
    justifyContent: 'center',
    // backgroundColor: 'red',
  },
  inputImageModal: {
    flex: 1,
    backgroundColor: colors.chatBg,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 6,
    fontSize: 14,
    color: colors.LightWhite,

    // marginLeft: 20,
  },
  addMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.moviesBg,
    height: 60,
    paddingRight: 5,
  },
  plusIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    tintColor: colors.gray,
  },
});
