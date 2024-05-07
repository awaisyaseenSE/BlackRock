import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  FlatList,
  StatusBar,
} from 'react-native';
import React, {useEffect, useRef, useState, useMemo} from 'react';
import ScreenComponent from '../../components/ScreenComponent';
import {useNavigation} from '@react-navigation/native';
import colors from '../../styles/colors';
import FastImage from 'react-native-fast-image';
import constants from '../../constants/constants';
import {FlashList, MasonryFlashList} from '@shopify/flash-list';
import navigationStrings from '../../navigation/navigationStrings';
import TextInputWithLeftIconCompo from '../../components/TextInputWithLeftIconCompo';
import fontFamily from '../../styles/fontFamily';
import {wallCategories} from './data';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import WallpaperFilterModal from './components/WallpaperFilterModal';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function WallpaperHomeScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [photos, setPhotos] = useState([]);
  const [nextPage, setNextPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [color, setColor] = useState('');
  const [showFilterModal, setShowFilterModel] = useState(false);
  const [type, setType] = useState('all');
  const [order, setOrder] = useState('popular');

  const insets = useSafeAreaInsets();

  const renderCategory = ({item}) => {
    return (
      <TouchableOpacity
        style={[
          styles.categoryContainer,
          {
            backgroundColor:
              item === selectedCategory
                ? colors.wallpaper_Light_Black
                : colors.wallpaper_white,
          },
        ]}
        onPress={() => {
          setSelectedCategory(item);
          setSearchText(item);
        }}
        activeOpacity={0.6}>
        <Text
          style={[
            styles.text,
            {
              color:
                item === selectedCategory
                  ? colors.wallpaper_white
                  : colors.wallpaper_Light_Black,
            },
          ]}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  const fetchPhotos = async (call, retryCount = 0) => {
    if (nextPage === null) return;

    let url;

    if (call === 'btnCall') {
      url = `${constants.pixabay_BASE_URL}?key=${
        constants.pixabay_API_KEY
      }&q=${encodeURIComponent(
        searchText,
      )}&image_type=${type}&page=1&per_page=60&orientation=vertical&colors=${color}`;
    } else {
      url = nextPage
        ? `${constants.pixabay_BASE_URL}?key=${
            constants.pixabay_API_KEY
          }&q=${encodeURIComponent(
            searchText,
          )}&image_type=${type}&page=${nextPage}&per_page=60&orientation=vertical&colors=${color}`
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

      console.log(result?.hits?.length);

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

  const getImageSize = (height, width) => {
    if (width > height) {
      return 250;
    } else if (width < height) {
      return 300;
    } else {
      return 200;
    }
  };

  const renderItem = ({item, index}) => {
    const getImageHeight = () => {
      let imgHeight = item?.imageHeight;
      let imgWidth = item?.imageWidth;
      let finalHei = getImageSize(imgHeight, imgWidth);
      return {height: finalHei};
    };

    let fastImgLoad = true;
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(navigationStrings.Detail_Photo_Screen, {
            data: item,
          })
        }
        activeOpacity={0.6}
        style={{padding: 2}}>
        {fastImgLoad && (
          <View style={styles.loadingImageStyle}>
            <ActivityIndicator size={'small'} color={colors.gray} />
          </View>
        )}
        <FastImage
          source={{uri: item?.largeImageURL}}
          style={[styles.pexelsImageStyle]}
          onLoadStart={() => (fastImgLoad = true)}
          onLoadEnd={() => (fastImgLoad = false)}
          defaultSource={require('../../assets/food/picture.png')}
        />
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={{alignItems: 'center', marginTop: 20}}>
        <ActivityIndicator animating size="large" color={colors.black} />
      </View>
    );
  };

  useEffect(() => {
    if (searchText !== '' && selectedCategory !== '') {
      handleFetchPhotoCall();
    }
  }, [selectedCategory, color, type, order]);

  const renderHeaderComponent = useMemo(() => {
    return (
      <View>
        <TextInputWithLeftIconCompo
          inputStyle={styles.inputContainer}
          value={searchText}
          onChangeText={text => {
            if (text.trim().length) {
              setSearchText(text);
            } else {
              setSearchText('');
            }
          }}
          maxLength={40}
          clearIcon={searchText.length > 0 ? 'Clear' : ''}
          onPressClear={() => setSearchText('')}
          placeholder={'Search Photos..'}
          placeholderTextColor={colors.gray}
          textStyle={{
            color: colors.food_light_black2,
          }}
          leftIconStyle={{tintColor: colors.gray}}
          onPress={() => handleFetchPhotoCall()}
        />
        <View style={{marginBottom: 12}}>
          <FlatList
            data={wallCategories}
            renderItem={renderCategory}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    );
  }, [searchText]);

  return (
    <>
      <StatusBar
        backgroundColor={colors.black}
        barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'}
      />
      <View
        style={[
          styles.container,
          {
            paddingTop: Platform.OS === 'ios' ? insets.top : 8,
          },
        ]}>
        <View style={styles.row}>
          <Text style={styles.heading}>WallJet</Text>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => setShowFilterModel(true)}>
            <Image
              source={require('../../assets/food/ic_filter.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
        <FlashList
          data={photos}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={renderFooter}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.1}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{marginVertical: 2}} />}
          estimatedItemSize={200}
          numColumns={2}
          ListHeaderComponent={renderHeaderComponent}
        />
      </View>
      {showFilterModal && (
        <WallpaperFilterModal
          showFilterModal={showFilterModal}
          setShowFilterModel={setShowFilterModel}
          setColor={setColor}
          color={color}
          type={type}
          setType={setType}
          order={order}
          setOrder={setOrder}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.wallpaper_gray,
  },
  inputContainer: {
    backgroundColor: colors.wallpaper_white,
    borderWidth: 0.5,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
    marginTop: 6,
  },
  heading: {
    fontSize: 22,
    color: colors.black,
    fontFamily: fontFamily.rubik_medium,
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: colors.black,
  },
  categoryContainer: {
    backgroundColor: colors.wallpaper_white,
    marginLeft: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  text: {
    fontSize: 14,
    fontFamily: fontFamily.rubik_regular,
    color: colors.wallpaper_Light_Black,
  },
  // below for show images
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
  pexelsImageStyle: {
    width: screenWidth / 2 - 10,
    height: screenHeight * 0.3,
    resizeMode: 'contain',
    borderRadius: 12,
    alignSelf: 'center',
    backgroundColor: colors.white,
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
});
