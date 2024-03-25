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

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function PexelsVideosScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [nextPage, setNextPage] = useState('');
  const perPage = 15;

  const getPopularVideos = async (call, retryCount = 0) => {
    if (nextPage === null) {
      return;
    }
    let url;
    if (call == 'btnCall') {
      url = `https://api.pexels.com/v1/videos/popular/?page=${0}&per_page=${perPage}`;
    } else {
      url =
        nextPage === ''
          ? `https://api.pexels.com/v1/videos/popular/?page=${0}&per_page=${perPage}`
          : nextPage.length > 10
          ? nextPage
          : null;
    }

    if (url === null) {
      return null;
    }

    const options = {
      method: 'GET',
      headers: {
        Authorization: constants.pexelApiKey,
      },
    };

    try {
      setLoading(true);
      const response = await fetch(url, options);

      if (response.status === 504 && retryCount < MAX_RETRY_COUNT) {
        const waitTime = retryCount * 1000; // Adjust wait time as needed
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return fetchPhotos(retryCount + 1);
      }

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      setPhotos(prevPhotos => [...prevPhotos, ...result.videos]);
      setNextPage(result.next_page || null);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const renderItem = ({item}) => {
    // console.log();
    // console.log('......................');
    let videoLink = item?.video_files[0]?.link;
    let fastImgLoad = true;
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() =>
          navigation.navigate(navigationStrings.Show_Video_Screen, {
            link: videoLink,
          })
        }>
        {fastImgLoad && (
          <View style={styles.loadingImageStyle}>
            <ActivityIndicator size={'small'} color={colors.gray} />
          </View>
        )}
        <FastImage
          source={{uri: item?.image}}
          style={styles.pexelsImageStyle}
          onLoadStart={() => (fastImgLoad = true)}
          onLoadEnd={() => (fastImgLoad = false)}
        />
        {!loading && (
          <View style={styles.loadingImageStyle}>
            <View style={styles.videoPlayerIconConatainer}>
              <Image
                source={require('../assets/music-player.png')}
                style={styles.downloadIcon}
              />
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={{alignItems: 'center', marginTop: 20}}>
        <ActivityIndicator animating size="large" color={colors.white} />
      </View>
    );
  };

  const handleEndReached = () => {
    if (nextPage !== null && photos.length > 4) {
      getPopularVideos();
    }
  };

  useEffect(() => {
    getPopularVideos();
  }, []);

  return (
    <>
      <ScreenComponent style={{backgroundColor: colors.moviesBg}}>
        <TopCompoWithHeading
          title="Polpular Videos"
          onPress={() => navigation.goBack()}
        />
        <TouchableOpacity
          style={styles.searchContainer}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate(navigationStrings.Search_Pexels_Videos)
          }>
          <Image
            source={require('../assets/tab_search.png')}
            style={styles.checkIcon}
          />
          <Text style={styles.text}>Search Videos...</Text>
        </TouchableOpacity>
        <View style={styles.container}>
          <FlashList
            data={photos}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={renderFooter}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.1}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => (
              <View style={{height: 4, backgroundColor: colors.bottomTabBg}} />
            )}
            // ListHeaderComponent={renderHeader}
            estimatedItemSize={200}
          />
        </View>
      </ScreenComponent>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pexelsImageStyle: {
    width: screenWidth,
    height: screenHeight * 0.26,
    resizeMode: 'contain',
  },
  inputStyle: {
    backgroundColor: colors.bottomTabBg,
    borderColor: colors.moviesBg,
    borderRadius: 24,
    flex: 1,
    marginBottom: 0,
  },
  checkIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: colors.LightWhite,
  },
  checkIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.bottomTabBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIconMainContainer: {
    marginLeft: 8,
  },
  textInputContainer: {
    // flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'space-between',
    // paddingHorizontal: 14,
    // marginBottom: 12,
  },
  loadingImageStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadContainer: {
    width: 44,
    height: 44,
    borderRadius: 44 / 2,
    backgroundColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 8,
    right: 12,
  },
  downloadIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: colors.white,
  },
  text: {
    fontSize: 12,
    color: colors.gray,
    fontFamily: '500',
    marginLeft: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.black,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  videoPlayerIconConatainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
