import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Alert,
  Platform,
  PermissionsAndroid,
  Linking,
} from 'react-native';
import React from 'react';
import colors from '../../../styles/colors';
import ShowReplyCompo from './ShowReplyCompo';

const AddNewMessageCompo = ({
  newTextMessage,
  setNewTextMessage,
  sendShow,
  setSendShow,
  sendMessage,
  setRecordingModal,
  captureImage,
  replyText,
  replyUserUid,
  closeReply,
  replyMessageType,
  receiverName,
  setSelectAttachment,
}) => {
  const checkRecordingPermission = async () => {
    try {
      if (Platform.OS == 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Recording Audio Permission Required',
            message:
              'App needs access to access Recording Audio Permission to record your voice!',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Recording Audio permission is granted');
          setRecordingModal(true);
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
      } else {
        setRecordingModal(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        // keyboardVerticalOffset={20}
      >
        <View style={styles.container}>
          {replyText.length > 0 ? (
            <ShowReplyCompo
              replyText={replyText}
              replyUserUid={replyUserUid}
              closeReply={closeReply}
              replyMessageType={replyMessageType}
              receiverName={receiverName}
            />
          ) : null}
          <View
            style={[styles.inputContainer, {backgroundColor: colors.chatBg}]}>
            <TouchableOpacity
              style={styles.leftIconContainer}
              onPress={captureImage}>
              <Image
                source={require('../../../assets/fill_camera.png')}
                style={styles.leftIcon}
              />
            </TouchableOpacity>
            <TextInput
              placeholder="Message..."
              placeholderTextColor={colors.gray}
              style={[styles.input, {color: colors.lightOffWhite}]}
              value={newTextMessage}
              onChangeText={text => {
                setNewTextMessage(text);
                if (text.trim().length) {
                  setSendShow(true);
                } else {
                  setSendShow(false);
                }
              }}
              multiline
            />
            {!sendShow ? (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styles.rightIconsContainer}
                  onPress={() => {
                    Alert.alert('emoji');
                  }}>
                  <Image
                    source={require('../../../assets/emoji.png')}
                    style={[styles.rightIcons]}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.rightIconsContainer, {marginLeft: 2}]}
                  onPress={() => setSelectAttachment(true)}>
                  <Image
                    source={require('../../../assets/attach-file.png')}
                    style={[styles.rightIcons, {width: 24, height: 24}]}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.rightIconsContainer}
                  onPress={() => {
                    // setRecordingModal(true);
                    checkRecordingPermission();
                  }}>
                  <Image
                    source={require('../../../assets/microphone.png')}
                    style={[
                      styles.rightIcons,
                      {height: 24, resizeMode: 'cover'},
                    ]}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.rightIconsContainer}
                onPress={() => {
                  if (newTextMessage !== '') {
                    if (!newTextMessage.trim().length) {
                      console.log('str is empty!');
                      setNewTextMessage('');
                      return;
                    }
                    sendMessage(newTextMessage.trim(), 'text');
                  } else {
                    setRecordingModal(true);
                  }
                }}>
                <Text style={styles.sendTextStyle}>Send</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 6,
    paddingVertical: 8,
    backgroundColor: colors.moviesBg,
  },
  leftIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: 'snow',
  },
  leftIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 36 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blue,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 22,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 14,
    height: '100%',
    textAlignVertical: 'top',
  },
  rightIcons: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: colors.gray,
  },
  rightIconsContainer: {
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  sendTextStyle: {
    fontSize: 16,
    color: colors.blue,
    fontWeight: '600',
  },
});

export default AddNewMessageCompo;
