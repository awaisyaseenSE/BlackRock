import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Animated,
} from 'react-native';
import React, {useEffect, useState, useRef, createRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import colors from '../styles/colors';
import FastImage from 'react-native-fast-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ActivityIndicator} from 'react-native';
import {handleDownload} from '../utils/FileDownloader';
import fontFamily from '../styles/fontFamily';
import {
  GestureHandlerRootView,
  PanGestureHandler,
  PinchGestureHandler,
  State,
} from 'react-native-gesture-handler';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function DetailPhotoScreen({route}) {
  const navigation = useNavigation();
  const photoData = route?.params?.data;
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(true);
  const [downloadUrlLoading, setDownloadUrlLoading] = useState(false);
  const [imgName, setImgName] = useState(photoData?.alt || '');
  const [showIosToast, setShowIosToast] = useState(true);

  const [panEnabled, setPanEnabled] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const pinchRef = createRef();
  const panRef = createRef();

  const onPinchEvent = Animated.event(
    [
      {
        nativeEvent: {scale},
      },
    ],
    {useNativeDriver: true},
  );

  const onPanEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: translateX,
          translationY: translateY,
        },
      },
    ],
    {useNativeDriver: true},
  );

  const handlePinchStateChange = ({nativeEvent}) => {
    // enabled pan only after pinch-zoom
    if (nativeEvent.state === State.ACTIVE) {
      setPanEnabled(true);
    }
    // when scale < 1, reset scale back to original (1)
    const nScale = nativeEvent.scale;
    if (nativeEvent.state === State.END) {
      if (nScale < 1) {
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();

        setPanEnabled(false);
      }
    }
  };

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    const delayedFunction = () => {
      setShowIosToast(false);
    };
    const timeoutId = setTimeout(delayedFunction, 3000);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <>
      <GestureHandlerRootView style={{flex: 1}}>
        <View
          style={[
            styles.container,
            {
              backgroundColor: photoData?.avg_color || colors.food_gray,
            },
          ]}>
          <PanGestureHandler
            onGestureEvent={onPanEvent}
            ref={panRef}
            simultaneousHandlers={[pinchRef]}
            enabled={panEnabled}
            failOffsetX={[-1000, 1000]}
            shouldCancelWhenOutside>
            <Animated.View>
              <PinchGestureHandler
                ref={pinchRef}
                onGestureEvent={onPinchEvent}
                simultaneousHandlers={[panRef]}
                onHandlerStateChange={handlePinchStateChange}>
                <Animated.Image
                  source={{
                    uri:
                      photoData?.src?.portrait ||
                      photoData?.largeImageURL ||
                      'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    transform: [{scale}, {translateX}, {translateY}],
                  }}
                  resizeMode="contain"
                  onLoadStart={handleLoadStart}
                  onLoadEnd={handleLoadEnd}
                />
              </PinchGestureHandler>
            </Animated.View>
          </PanGestureHandler>
          {/* <FastImage
            source={{uri: photoData?.src?.portrait || photoData?.largeImageURL}}
            style={styles.imageStyle}
            resizeMode="cover"
            onLoadStart={handleLoadStart}
            onLoadEnd={handleLoadEnd}
          /> */}
          {isLoading && (
            <View style={styles.placeholder}>
              <ActivityIndicator size="large" color={colors.black} />
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.iconContainer,
              {
                top: Platform.OS === 'ios' ? insets.top : 14,
              },
            ]}
            onPress={() => {
              navigation.goBack();
            }}>
            <Image
              source={require('../assets/backward.png')}
              style={styles.icon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.downlaodIconConatianer,
              {
                top: Platform.OS === 'ios' ? insets.top : 14,
              },
            ]}
            onPress={() =>
              handleDownload(
                photoData?.src?.portrait || photoData?.largeImageURL,
                setDownloadUrlLoading,
              )
            }>
            {downloadUrlLoading ? (
              <ActivityIndicator size={'small'} color={colors.white} />
            ) : (
              <Image
                source={require('../assets/ic_download.png')}
                style={styles.icon}
              />
            )}
          </TouchableOpacity>
          {showIosToast && imgName && (
            <View
              style={[
                styles.toast,
                {bottom: Platform.OS === 'ios' ? insets.bottom : 30},
              ]}>
              <Text style={styles.toastTxt}>{imgName}</Text>
            </View>
          )}
        </View>
      </GestureHandlerRootView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageStyle: {
    width: screenWidth,
    height: screenHeight,
    resizeMode: 'cover',
  },
  icon: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
    tintColor: colors.LightWhite,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.black,
    position: 'absolute',
    left: 20,
  },
  placeholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  downlaodIconConatianer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.black,
    position: 'absolute',
    right: 20,
  },
  toast: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    marginHorizontal: 30,
  },
  toastTxt: {
    fontSize: 12,
    color: colors.lightOffWhite,
    fontFamily: fontFamily.rubik_medium,
  },
});
