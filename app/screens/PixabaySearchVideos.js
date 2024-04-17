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

export default function PixabaySearchVideos() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [photos, setPhotos] = useState([]);
  const [nextPage, setNextPage] = useState(1);

  const fetchPhotos = async (call, retryCount = 0) => {
    if (nextPage === null) return;

    let url;

    if (call === 'btnCall') {
      url = `${constants.pixabay_BASE_URL}/videos/?key=${
        constants.pixabay_API_KEY
      }&q=${encodeURIComponent(searchText)}&video_type=all&page=1&per_page=20`;
    } else {
      url = nextPage
        ? `${constants.pixabay_BASE_URL}/videos/?key=${
            constants.pixabay_API_KEY
          }&q=${encodeURIComponent(
            searchText,
          )}&video_type=all&page=${nextPage}&per_page=20`
        : null;
    }

    if (!url) return;

    try {
      setLoading(true);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      if (nextPage <= result.totalHits) {
        setPhotos(prevPhotos => [...prevPhotos, ...result.hits]);
        setNextPage(nextPage + 1);
      } else {
        setNextPage(null);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const handleEndReached = () => {
    if (!loading && nextPage !== null) {
      fetchPhotos('scroll');
    }
  };

  const handleFetchPhotoCall = () => {
    if (searchText.length > 0) {
      setPhotos([]);
      setNextPage(1); // Reset nextPage to 1 when making a new search
      fetchPhotos('btnCall', 1, [], 0); // Pass 1 as the initial page number and an empty array as prevPhotos initially
    } else {
      setPhotos([]);
      setNextPage(null);
    }
  };
  const renderItem = ({item}) => {
    let fastImgLoad = true;
    let videoLink = item?.videos?.large?.url || item?.videos?.medium?.url;
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(navigationStrings.Show_Video_Screen, {
            link: videoLink,
          })
        }
        activeOpacity={0.6}
        style={{
          padding: 2,
        }}>
        {fastImgLoad && (
          <View style={styles.loadingImageStyle}>
            <ActivityIndicator size={'small'} color={colors.gray} />
          </View>
        )}
        <FastImage
          source={{uri: item?.videos?.medium?.thumbnail}}
          style={styles.pexelsImageStyle}
          onLoadStart={() => (fastImgLoad = true)}
          onLoadEnd={() => (fastImgLoad = false)}
        />
        <Image
          source={require('../assets/video_button.png')}
          style={styles.videoIcon}
        />
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

  return (
    <>
      <ScreenComponent style={{backgroundColor: colors.moviesBg}}>
        <TopCompoWithHeading
          title="Search Videos"
          onPress={() => navigation.goBack()}
        />
        <View style={styles.container}>
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
                setPhotos([]);
                setNextPage('');
              }}
              placeholder="Search Videos..."
              placeholderTextColor="gray"
            />
            <View style={styles.checkIconMainContainer}>
              <TouchableOpacity
                style={styles.checkIconContainer}
                onPress={handleFetchPhotoCall}>
                <Image
                  source={require('../assets/check.png')}
                  style={styles.checkIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
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
            numColumns={2}
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
  checkIconMainContainer: {
    marginLeft: 8,
  },
  checkIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: colors.LightWhite,
  },
  inputStyle: {
    backgroundColor: colors.bottomTabBg,
    borderColor: colors.moviesBg,
    borderRadius: 24,
    flex: 1,
    marginBottom: 0,
  },
  pexelsImageStyle: {
    width: screenWidth / 2 - 10,
    height: screenHeight * 0.3,
    resizeMode: 'contain',
    borderRadius: 12,
    alignSelf: 'center',
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
  videoIcon: {
    width: 20,
    height: 20,
    tintColor: colors.white,
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
});
