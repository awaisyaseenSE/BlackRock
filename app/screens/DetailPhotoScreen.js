import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import colors from '../styles/colors';
import FastImage from 'react-native-fast-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ActivityIndicator} from 'react-native';
import {handleDownload} from '../utils/FileDownloader';
import fontFamily from '../styles/fontFamily';

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
      <View
        style={[
          styles.container,
          {backgroundColor: photoData?.avg_color || colors.moviesBg},
        ]}>
        {isLoading && (
          <View style={styles.placeholder}>
            <ActivityIndicator size="large" color={colors.black} />
          </View>
        )}
        <FastImage
          source={{uri: photoData?.src?.portrait}}
          style={styles.imageStyle}
          resizeMode="contain"
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
        />
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
            handleDownload(photoData?.src?.portrait, setDownloadUrlLoading)
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
