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
import TextInputWithLeftIconCompo from '../components/TextInputWithLeftIconCompo';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function SearchPexelsVideos() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [videos, setVideos] = useState([]);
  const [nextPage, setNextPage] = useState('');
  const perPage = 15;

  const searchVideos = async (call, retryCount = 0) => {
    // try {
    //   setLoading(true);
    //   const response = await fetch(
    //     `https://api.pexels.com/videos/search?query=${query}&per_page=${perPage}`,
    //     {
    //       headers: {
    //         Authorization: constants.pexelApiKey,
    //       },
    //     },
    //   );

    //   if (!response.ok) {
    //     setLoading(false);
    //     throw new Error(`HTTP error! Status: ${response.status}`);
    //   }

    //   const data = await response.json();
    //   console.log(data);
    //   setVideos(data.videos);
    //   setLoading(false);
    // } catch (error) {
    //   setLoading(false);
    //   console.error('Error searching videos:', error);
    // }
    if (nextPage === null) return; // If there are no more pages, don't fetch

    let url;

    if (call == 'btnCall') {
      url = `https://api.pexels.com/videos/search?query=${searchText}&per_page=${perPage}`;
    } else {
      url =
        nextPage === ''
          ? `https://api.pexels.com/videos/search?query=${searchText}&per_page=${perPage}`
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
        setLoading(false);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      setVideos(preVideos => [...preVideos, ...result.videos]);
      setNextPage(result.next_page || null);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleFetchVideoCall = () => {
    if (searchText.length > 0) {
      setVideos([]);
      setNextPage('');
      searchVideos('btnCall', 0);
    } else {
      setVideos([]);
      setNextPage(null);
    }
  };

  const renderItem = ({item}) => {
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
    if (nextPage !== null && videos.length > 4) {
      searchVideos();
    }
  };

  return (
    <>
      <ScreenComponent style={{backgroundColor: colors.moviesBg}}>
        <TopCompoWithHeading
          title="Search Videos"
          onPress={() => navigation.goBack()}
        />
        <View style={styles.textInputContainer}>
          <TextInputWithLeftIconCompo
            value={searchText}
            onChangeText={text => {
              if (text.trim().length) {
                setSearchText(text);
              } else {
                setSearchText('');
              }
            }}
            maxLength={30}
            inputStyle={styles.inputStyle}
            clearIcon={searchText.length > 0 ? 'Clear' : ''}
            onPressClear={() => {
              setSearchText('');
              setVideos([]);
              // setNextPage('');
            }}
            placeholder="Search Photos..."
            placeholderTextColor="gray"
          />
          <View style={styles.checkIconMainContainer}>
            <TouchableOpacity
              style={styles.checkIconContainer}
              onPress={handleFetchVideoCall}>
              <Image
                source={require('../assets/check.png')}
                style={styles.checkIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.container}>
          <FlashList
            data={videos}
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
  inputStyle: {
    backgroundColor: colors.bottomTabBg,
    borderColor: colors.moviesBg,
    borderRadius: 24,
    flex: 1,
    marginBottom: 0,
  },
  checkIconMainContainer: {
    marginLeft: 8,
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  checkIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.bottomTabBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: colors.LightWhite,
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
  pexelsImageStyle: {
    width: screenWidth,
    height: screenHeight * 0.26,
    resizeMode: 'contain',
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
  videoPlayerIconConatainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
