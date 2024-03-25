import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenComponent from '../components/ScreenComponent';
import {useNavigation} from '@react-navigation/native';
import colors from '../styles/colors';
import TopCompoWithHeading from '../components/TopCompoWithHeading';
import FastImage from 'react-native-fast-image';
import constants from '../constants/constants';
import {Image} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import navigationStrings from '../navigation/navigationStrings';
import Video from 'react-native-video';
import MyIndicatorLoader from '../components/MyIndicatorLoader';
import {handleDownload} from '../utils/FileDownloader';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function ShowVideoScreen({route}) {
  let videoLink = route?.params?.link;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [pauseVideo, setPauseVideo] = useState(false);
  const [downloadUrlLoading, setDownloadUrlLoading] = useState(false);

  return (
    <>
      <ScreenComponent style={{backgroundColor: colors.moviesBg}}>
        <TopCompoWithHeading
          onPress={() => navigation.goBack()}
          rightIcon={require('../assets/ic_download.png')}
          rightIconContainerStyle={styles.downlaodContainer}
          onPressRight={() => handleDownload(videoLink, setDownloadUrlLoading)}
          loading={downloadUrlLoading}
        />
        <View style={styles.container}>
          <Video
            style={{
              width: screenWidth,
              height: '100%',
              backgroundColor: colors.moviesBg,
            }}
            source={{uri: videoLink}}
            resizeMode="contain"
            repeat
            paused={pauseVideo}
            onLoad={() => setLoading(false)}
          />
          {!loading && (
            <View style={styles.videoPlayBtnWrapepr}>
              <TouchableOpacity
                style={styles.videoPlayBtnIconContainer}
                onPress={() => setPauseVideo(!pauseVideo)}>
                <Image
                  source={
                    pauseVideo
                      ? require('../assets/ic_play.png')
                      : require('../assets/pause-button.png')
                  }
                  style={styles.videoPlayBtnIcon}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScreenComponent>
      <MyIndicatorLoader visible={loading} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  videoPlayBtnIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    tintColor: 'snow',
  },
  videoPlayBtnIconContainer: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downlaodContainer: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    width: 40,
    height: 40,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
});
