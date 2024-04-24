import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
  Modal,
  Linking,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import FastImage from 'react-native-fast-image';
import colors from '../../../styles/colors';
import auth from '@react-native-firebase/auth';
import SoundPlayer from 'react-native-sound-player';
import BackgroundTimer from 'react-native-background-timer';
import * as Progress from 'react-native-progress';
import Video from 'react-native-video';
import storage from '@react-native-firebase/storage';
import {
  GestureHandlerRootView,
  FlingGestureHandler,
  Directions,
  State,
} from 'react-native-gesture-handler';
import Animated, {
  withSpring,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  useSharedValue,
  event,
} from 'react-native-reanimated';
import firestore from '@react-native-firebase/firestore';
import ShowReplyMessageCompo from './ShowReplyMessageCompo';
import moment from 'moment';
import ScreenComponent from '../../../components/ScreenComponent';
import fontFamily from '../../../styles/fontFamily';
const ShowMessagesComponent = ({
  item,
  startPlaying,
  stopPlaying,
  swipeToReply,
  closeReply,
}) => {
  const senderId = auth().currentUser.uid;
  // const formatedTime1 = item.time?.getHours() + ':' + item.time?.getMinutes();
  var hours = item.time?.getHours();
  hours = ('0' + hours).slice(-2);
  var minutes = item.time?.getMinutes();
  minutes = ('0' + minutes).slice(-2);

  const formatedTime = hours + '.' + minutes;
  const [currentPlaying, setCurrentPlaying] = useState(0);
  const [isAudioLoading, setIsAudioLoading] = useState(true);
  const [durationTime, setDurationTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const screenWidth = Dimensions.get('window').width;
  const [show, setShow] = useState(true);
  const [replyData, setReplyData] = useState(null);
  const [showFullImage, setShowFullImage] = useState(false);
  const [pauseVideo, setPauseVideo] = useState(true);

  var isMounted = false;
  //   useEffect(() => {
  //     isMounted = true;

  //     async function getDuration() {
  //       const durationInfo = await SoundPlayer.getInfo();
  //       console.log('call');
  //       setDurationTime(durationInfo.duration);
  //       console.log('dfdf', durationInfo.duration);
  //     }
  //     getDuration();
  //     return () => (isMounted = false);
  //   }, []);

  //   console.log('item isplaying ', item.isPlaying);

  const getInfo = async () => {
    const info = await SoundPlayer.getInfo();
    // console.log('info of voice: ', info);
    if (info.duration !== undefined) {
      setTotalDuration(Math.ceil(info.duration));
      //   console.log('voice time duration is: ', Math.ceil(info.duration));
    }
    if (info.currentTime !== undefined) {
      if (info.currentTime !== 0) {
        setIsAudioLoading(false);
      }
      var tim = Math.ceil(info.currentTime);
      var tot = Math.ceil(info.duration);
      // var tim = info.currentTime;
      // var tot = info.duration;
      var final = tim / tot;
      setCurrentPlaying(final);
    }
  };

  function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return seconds == 60
      ? minutes + 1 + ':00'
      : minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }

  var _onFinishedPlayingSubscription = null;
  var _onFinishedLoadingURLSubscription = null;
  const startTimer = () => {
    BackgroundTimer.stopBackgroundTimer();
    try {
      SoundPlayer.playUrl(item.message);
      BackgroundTimer.runBackgroundTimer(() => {
        getInfo();
        _onFinishedPlayingSubscription = SoundPlayer.addEventListener(
          'FinishedPlaying',
          ({success}) => {
            setCurrentPlaying(1);
            stopPlaying();
            BackgroundTimer.stopBackgroundTimer();
          },
          'FinishedLoading',
          ({success}) => {},
          'FinishedLoadingURL',
          ({success}) => {},
        );
      }, 1000);
    } catch (e) {
      Alert.alert('Error', 'Cannot play the file');
      console.log(`cannot play the sound file`, e);
    }
  };
  let startingPosition = 0;
  const x = useSharedValue(startingPosition);

  const eventHandler = useAnimatedGestureHandler({
    onStart: (event, ctx) => {},
    onActive: (event, ctx) => {
      //   x.value = item.senderID === senderId ? -50 : 50;
      x.value = 50;
    },
    onEnd: (event, ctx) => {
      x.value = withSpring(startingPosition);
    },
  });

  const useAmiStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: x.value}],
    };
  });

  const getFilenameFromFirebaseUrl = url => {
    const parts = url.split('/');

    const filenameWithQuery = parts.pop();
    const filenameParts = filenameWithQuery.split('?');
    let filename = filenameParts[0];
    if (filename.startsWith('chatMedia%2F')) {
      filename = filename.substring(12);
    }
    filename = decodeURIComponent(filename);
    return filename;
  };

  const deleteMessageHandler = async () => {
    try {
      if (item?.chatID !== undefined) {
        await firestore()
          .collection('chats')
          .doc(item?.chatID)
          .collection('messages')
          .doc(item?._id)
          .delete();

        if (
          item.type == 'image' ||
          item.type == 'video' ||
          item?.type?.startsWith('file') ||
          item?.type == 'audio'
        ) {
          const imgRef = storage().refFromURL(item?.message);
          await imgRef.delete();
        }
      } else {
        return null;
      }
    } catch (error) {
      console.log(
        'Error while deleting message in Show Mwssages component: ',
        error,
      );
    }
  };

  const handleDeleteMessage = () => {
    try {
      if (item?.senderID === auth().currentUser?.uid) {
        Alert.alert('Warning', 'Are you sure to Delete this Message!', [
          {
            text: 'Yes',
            onPress: deleteMessageHandler,
          },
          {
            text: 'No',
          },
        ]);
      } else {
        return null;
      }
    } catch (error) {
      console.log('Error while deleting message in chat screen: ', error);
    }
  };

  return (
    <>
      <GestureHandlerRootView>
        <FlingGestureHandler
          direction={Directions.RIGHT}
          onGestureEvent={eventHandler}
          onHandlerStateChange={({nativeEvent}) => {
            if (nativeEvent.state === State.ACTIVE) {
              swipeToReply(item);
            }
          }}>
          <Animated.View
            style={[
              {
                alignItems:
                  item.senderID === senderId ? 'flex-end' : 'flex-start',
              },
              useAmiStyle,
            ]}>
            <View
              style={[
                styles.container,
                {
                  backgroundColor:
                    item.senderID === senderId
                      ? colors.blue
                      : colors.lightOffWhite,
                  maxWidth: screenWidth / 2,
                  minWidth: screenWidth / 3,
                  borderBottomLeftRadius: item.senderID === senderId ? 12 : 0,
                  borderBottomRightRadius: item.senderID === senderId ? 0 : 12,
                },
              ]}>
              {item.replyId !== undefined ? (
                <ShowReplyMessageCompo
                  senderId={senderId}
                  messageSender={item.senderID}
                  chatId={item.chatID}
                  replyId={item.replyId}
                />
              ) : null}
              {item.type == 'image' ? (
                <>
                  <TouchableOpacity
                    onPress={() => setShowFullImage(true)}
                    onLongPress={() => handleDeleteMessage()}>
                    <FastImage
                      source={{uri: item.message}}
                      style={[
                        styles.imageStyle,
                        {
                          width: screenWidth / 2 - 20,
                        },
                      ]}
                    />
                  </TouchableOpacity>
                  {item.extraText !== '' ? (
                    <Text
                      style={[
                        styles.chatTextStyle,
                        {
                          color:
                            item.senderID === senderId
                              ? colors.white
                              : colors.black,
                        },
                      ]}>
                      {item.extraText}
                    </Text>
                  ) : null}
                </>
              ) : null}
              {item.type == 'file/pdf' ? (
                <TouchableOpacity
                  onPress={() => {
                    let properUrl = item.message;

                    if (!/^https?:\/\//i.test(item.message)) {
                      properUrl = `http://${item.message}`;
                    }

                    Linking.openURL(properUrl).catch(error => {
                      console.log(error);
                    });
                  }}
                  style={{
                    flexDirection: 'row',
                    paddingRight: 10,
                  }}
                  onLongPress={() => handleDeleteMessage()}>
                  <Image
                    source={require('../../../assets/ic_document.png')}
                    style={[
                      styles.iconDocument,
                      {
                        tintColor:
                          item.senderID === senderId
                            ? colors.offWhite
                            : colors.black,
                      },
                    ]}
                  />

                  {item.extraText !== '' ? (
                    <Text
                      style={[
                        styles.chatTextStyle,
                        {
                          color:
                            item.senderID === senderId
                              ? colors.white
                              : colors.black,
                          marginLeft: 6,
                        },
                      ]}>
                      {item.extraText}
                    </Text>
                  ) : (
                    <Text style={{marginLeft: 6, color: colors.LightWhite}}>
                      {getFilenameFromFirebaseUrl(item.message)}
                    </Text>
                  )}
                </TouchableOpacity>
              ) : null}

              {item.type == 'file/doc' ? (
                <TouchableOpacity
                  onLongPress={() => handleDeleteMessage()}
                  onPress={() => {
                    let properUrl = item.message;

                    if (!/^https?:\/\//i.test(item.message)) {
                      properUrl = `http://${item.message}`;
                    }

                    Linking.openURL(properUrl).catch(error => {
                      console.log(error);
                    });
                  }}
                  style={{
                    flexDirection: 'row',
                    paddingRight: 10,
                  }}>
                  <Image
                    source={require('../../../assets/ic_doc.png')}
                    style={[styles.iconDocument]}
                  />

                  {item.extraText !== '' ? (
                    <Text
                      style={[
                        styles.chatTextStyle,
                        {
                          color:
                            item.senderID === senderId
                              ? colors.white
                              : colors.black,
                          marginLeft: 6,
                        },
                      ]}>
                      {item.extraText}
                    </Text>
                  ) : (
                    <Text style={{marginLeft: 6, color: colors.LightWhite}}>
                      {getFilenameFromFirebaseUrl(item.message)}
                    </Text>
                  )}
                </TouchableOpacity>
              ) : null}

              {item.type == 'file/txt' ? (
                <TouchableOpacity
                  onLongPress={() => handleDeleteMessage()}
                  onPress={() => {
                    let properUrl = item.message;

                    if (!/^https?:\/\//i.test(item.message)) {
                      properUrl = `http://${item.message}`;
                    }

                    Linking.openURL(properUrl).catch(error => {
                      console.log(error);
                    });
                  }}
                  style={{
                    flexDirection: 'row',
                    paddingRight: 10,
                  }}>
                  <Image
                    source={require('../../../assets/ic_txt.png')}
                    style={[styles.iconDocument]}
                  />

                  {item.extraText !== '' ? (
                    <Text
                      style={[
                        styles.chatTextStyle,
                        {
                          color:
                            item.senderID === senderId
                              ? colors.white
                              : colors.black,
                          marginLeft: 6,
                        },
                      ]}>
                      {item.extraText}
                    </Text>
                  ) : (
                    <Text style={{marginLeft: 6, color: colors.LightWhite}}>
                      {getFilenameFromFirebaseUrl(item.message)}
                    </Text>
                  )}
                </TouchableOpacity>
              ) : null}

              {item.type == 'file/pptx' ? (
                <TouchableOpacity
                  onLongPress={() => handleDeleteMessage()}
                  onPress={() => {
                    let properUrl = item.message;

                    if (!/^https?:\/\//i.test(item.message)) {
                      properUrl = `http://${item.message}`;
                    }

                    Linking.openURL(properUrl).catch(error => {
                      console.log(error);
                    });
                  }}
                  style={{
                    flexDirection: 'row',
                    paddingRight: 10,
                  }}>
                  <Image
                    source={require('../../../assets/pptx-file.png')}
                    style={[styles.iconDocument]}
                  />

                  {item.extraText !== '' ? (
                    <Text
                      style={[
                        styles.chatTextStyle,
                        {
                          color:
                            item.senderID === senderId
                              ? colors.white
                              : colors.black,
                          marginLeft: 6,
                        },
                      ]}>
                      {item.extraText}
                    </Text>
                  ) : (
                    <Text style={{marginLeft: 6, color: colors.LightWhite}}>
                      {getFilenameFromFirebaseUrl(item.message)}
                    </Text>
                  )}
                </TouchableOpacity>
              ) : null}

              {item.type == 'file/csv' ? (
                <TouchableOpacity
                  onLongPress={() => handleDeleteMessage()}
                  onPress={() => {
                    let properUrl = item.message;

                    if (!/^https?:\/\//i.test(item.message)) {
                      properUrl = `http://${item.message}`;
                    }

                    Linking.openURL(properUrl).catch(error => {
                      console.log(error);
                    });
                  }}
                  style={{
                    flexDirection: 'row',
                    paddingRight: 10,
                  }}>
                  <Image
                    source={require('../../../assets/ic_csv.png')}
                    style={[styles.iconDocument]}
                  />

                  {item.extraText !== '' ? (
                    <Text
                      style={[
                        styles.chatTextStyle,
                        {
                          color:
                            item.senderID === senderId
                              ? colors.white
                              : colors.black,
                          marginLeft: 6,
                        },
                      ]}>
                      {item.extraText}
                    </Text>
                  ) : (
                    <Text style={{marginLeft: 6, color: colors.LightWhite}}>
                      {getFilenameFromFirebaseUrl(item.message)}
                    </Text>
                  )}
                </TouchableOpacity>
              ) : null}

              {item.type == 'text' ? (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onLongPress={() => handleDeleteMessage()}>
                  <Text
                    style={[
                      styles.chatTextStyle,
                      {
                        color:
                          item.senderID === senderId
                            ? colors.white
                            : colors.black,
                      },
                    ]}>
                    {item.message}
                  </Text>
                </TouchableOpacity>
              ) : null}
              {item.type === 'audio' ? (
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor:
                      item.senderID === senderId ? colors.blue : colors.white,
                    paddingHorizontal: 10,
                    paddingVertical: 8,
                    borderRadius: 6,
                    justifyContent: 'space-between',
                    width: screenWidth / 3,
                  }}
                  onLongPress={() => handleDeleteMessage()}>
                  {item.isPlaying === false ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          setIsAudioLoading(true);
                          startTimer();
                          startPlaying();
                        }}>
                        <Image
                          source={require('../../../assets/ic_play.png')}
                          style={{
                            height: 16,
                            width: 16,
                            //   alignSelf: 'center',
                            resizeMode: 'contain',
                            tintColor:
                              item.senderID === senderId
                                ? colors.white
                                : colors.black,
                          }}
                        />
                      </TouchableOpacity>
                      {item.extraText !== '' ? (
                        <Text
                          style={{
                            color:
                              item.senderID === senderId
                                ? colors.white
                                : colors.black,
                            marginLeft: 8,
                          }}>
                          {millisToMinutesAndSeconds(item.extraText)}
                        </Text>
                      ) : null}
                    </View>
                  ) : isAudioLoading ? (
                    <Progress.Circle
                      size={20}
                      indeterminate={true}
                      color={
                        item.senderID === senderId ? colors.white : colors.black
                      }
                    />
                  ) : (
                    // <Text>loading</Text>
                    <TouchableOpacity
                      onPress={() => {
                        stopPlaying();
                        BackgroundTimer.stopBackgroundTimer();
                      }}>
                      <Image
                        source={require('../../../assets/ic_pause.png')}
                        style={{
                          height: 20,
                          width: 20,
                          alignSelf: 'center',
                          tintColor:
                            item.senderID === senderId
                              ? colors.white
                              : colors.black,
                        }}
                      />
                    </TouchableOpacity>
                  )}
                  {item.isPlaying === false ? (
                    <>
                      <Image
                        source={require('../../../assets/ic_sound.png')}
                        style={[
                          styles.soundImgStyle,
                          {
                            tintColor:
                              item.senderID === senderId
                                ? colors.white
                                : colors.black,
                            marginLeft: 6,
                          },
                        ]}
                      />
                    </>
                  ) : (
                    <View style={{height: 30, justifyContent: 'center'}}>
                      <Progress.Bar
                        progress={currentPlaying}
                        width={screenWidth / 5}
                        height={4}
                        color={colors.blue}
                        borderColor={
                          item.senderID === senderId
                            ? colors.white
                            : colors.black
                        }
                        unfilledColor={colors.white}
                        style={{
                          alignSelf: 'center',
                          // width: screenWidth * 0.2,
                          width: screenWidth / 5,
                          marginLeft: 10,
                        }}
                      />
                    </View>
                    // <Text>progress bar {currentPlaying}</Text>
                  )}
                </TouchableOpacity>
              ) : null}

              {item.type == 'video' && item.message ? (
                <>
                  <TouchableOpacity
                    onPress={() => setShowFullImage(true)}
                    onLongPress={() => handleDeleteMessage()}>
                    {!!item?.message && (
                      <Video
                        style={[
                          styles.imageStyle,
                          {
                            width: screenWidth / 2 - 20,
                          },
                        ]}
                        source={{uri: item?.message}}
                        resizeMode="cover"
                        poster="https://e1.pxfuel.com/desktop-wallpaper/802/816/desktop-wallpaper-black-iphone-7-posted-by-michelle-mercado-black-ios.jpg"
                        posterResizeMode="cover"
                        repeat
                        paused={pauseVideo}
                      />
                    )}
                    <View style={styles.videoPlayBtnWrapepr}>
                      <TouchableOpacity
                        style={styles.videoPlayBtnIconContainer}
                        onPress={() => setPauseVideo(!pauseVideo)}>
                        <Image
                          source={
                            pauseVideo
                              ? require('../../../assets/ic_play.png')
                              : require('../../../assets/pause-button.png')
                          }
                          style={styles.videoPlayBtnIcon}
                        />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                </>
              ) : null}

              <Text
                style={[
                  styles.chatTimeText,
                  {
                    alignSelf:
                      item.senderID === senderId ? 'flex-end' : 'flex-start',
                    marginTop: 3,
                    color:
                      item.senderID === senderId ? colors.white : colors.black,
                  },
                ]}>
                {formatedTime}
              </Text>
            </View>
          </Animated.View>
        </FlingGestureHandler>
      </GestureHandlerRootView>
      {showImageFunction()}
    </>
  );

  function showImageFunction() {
    return (
      <Modal visible={showFullImage} animationType="slide" transparent={true}>
        <ScreenComponent>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {/* <FastImage
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: colors.white,
              }}
              source={{uri: item.message}}
              resizeMode="contain"
            /> */}

            {item.type == 'image' && (
              <FastImage
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: colors.moviesBg,
                }}
                source={{uri: item.message}}
                resizeMode="contain"
              />
            )}
            {item.type == 'video' && item.message && (
              <TouchableOpacity
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: colors.black,
                }}
                onPress={() => setPauseVideo(!pauseVideo)}>
                <Video
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: colors.moviesBg,
                  }}
                  source={{uri: item?.message}}
                  resizeMode="contain"
                  repeat
                  paused={pauseVideo}
                />
                <View style={styles.videoPlayBtnWrapepr}>
                  <TouchableOpacity
                    style={styles.videoPlayBtnIconContainer}
                    onPress={() => setPauseVideo(!pauseVideo)}>
                    <Image
                      source={
                        pauseVideo
                          ? require('../../../assets/ic_play.png')
                          : require('../../../assets/pause-button.png')
                      }
                      style={styles.videoPlayBtnIcon}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => {
                setShowFullImage(false);
              }}
              style={{
                position: 'absolute',
                top: 30,
                right: 20,
                backgroundColor: 'white',
                padding: 10,
                borderRadius: 20,
              }}>
              <Image
                source={require('../../../assets/close.png')}
                style={{
                  width: 12,
                  height: 12,
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
          </View>
        </ScreenComponent>
      </Modal>
    );
  }
};

const styles = StyleSheet.create({
  chatTextStyle: {
    fontSize: 14,
    color: colors.black,
    fontFamily: fontFamily.rubik_medium,
  },
  chatTimeText: {
    fontSize: 10,
    color: colors.black,
    fontFamily: fontFamily.rubik_regular,
  },
  container: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  imageStyle: {
    width: 230,
    height: 120,
    borderRadius: 4,
    marginBottom: 8,
  },
  soundImgStyle: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    tintColor: colors.white,
    // backgroundColor: 'red',
  },
  playiconstyle: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
    tintColor: colors.white,
  },
  voiceMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.blue2,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  voiceDurationText: {
    fontSize: 12,
    color: colors.white,
    marginHorizontal: 8,
    fontFamily: fontFamily.rubik_regular,
  },
  iconDocument: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  videoStyle: {
    width: 230,
    height: 120,
    borderRadius: 4,
    marginBottom: 8,
  },
  videoPlayBtnWrapepr: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoPlayBtnIconContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 34,
    height: 34,
    borderRadius: 34 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoPlayBtnIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    tintColor: 'snow',
  },
});

export default ShowMessagesComponent;
