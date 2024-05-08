import {
  View,
  Platform,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  Keyboard,
} from 'react-native';
import React, {useEffect, useState, useMemo, useRef} from 'react';
import colors from '../../styles/colors';
import constants from '../../constants/constants';
import {useNavigation} from '@react-navigation/native';
import fontFamily from '../../styles/fontFamily';
import FastImage from 'react-native-fast-image';
import navigationStrings from '../../navigation/navigationStrings';
import {MasonryFlashList} from '@shopify/flash-list';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import TextInputWithLeftIconCompo from '../../components/TextInputWithLeftIconCompo';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function UnsplashHomeScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [photos, setPhotos] = useState([]);
  const perPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const insets = useSafeAreaInsets();

  const handleGetPhotos = async () => {
    let baseUrl = `https://api.unsplash.com/photos?page=${currentPage}&per_page=${perPage}&client_id=${constants.unsplash_Access_KEY}`;
    let searchUrl = `${constants.unsplash_Search_base_URL}page=${currentPage}&per_page=${perPage}&query=${searchText}&client_id=${constants.unsplash_Access_KEY}`;
    let finalBaseUrl = searchText !== '' ? searchUrl : baseUrl;
    try {
      let url = finalBaseUrl;
      console.log('url: ', url);
      setLoading(true);

      const response = await fetch(url);

      if (!response.ok) {
        setLoading(false);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      if (searchText !== '') {
        if (!!result && result?.results?.length > 0) {
          setPhotos(prevPhotos => [...prevPhotos, ...result.results]);
          setTotalPages(result.total_pages);
          if (currentPage < result?.total_pages) {
            setCurrentPage(currentPage + 1);
          }
          console.log('Unsplash Response:  ', result?.results?.length);
        }
      } else {
        setPhotos(prevPhotos => [...prevPhotos, ...result]);
        setCurrentPage(currentPage + 1);
        console.log(result?.length);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(
        'Error in fetching photos from unsplash api in handleGetPhotos function: ',
        error,
      );
    }
  };

  useEffect(() => {
    handleGetPhotos();
  }, []);

  const handleEndReached = () => {
    if (!loading) {
      handleGetPhotos();
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

  const renderItem = ({item}) => {
    const getImageHeight = () => {
      let imgHeight = item?.height;
      let imgWidth = item?.width;
      let finalHei = getImageSize(imgHeight, imgWidth);
      return {height: finalHei};
    };

    return (
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={() =>
          navigation.navigate(navigationStrings.Detail_Photo_Screen, {
            data: item,
          })
        }
        activeOpacity={0.6}>
        <FastImage
          source={{uri: item?.urls?.full}}
          style={[styles.imageStyle, getImageHeight()]}
        />
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={{alignItems: 'center', marginTop: 20}}>
        <ActivityIndicator animating size="large" color={colors.dark_Red} />
      </View>
    );
  };

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
          onPress={() => {
            Keyboard.dismiss;
            setCurrentPage(1);
            setPhotos([]);
            handleGetPhotos();
          }}
          loading={loading}
        />
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
            onPress={() => {
              Keyboard.dismiss;
              setCurrentPage(1);
              setPhotos([]);
              handleGetPhotos();
            }}
            loading={loading}
          />
        </View>
        <MasonryFlashList
          data={photos}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{marginVertical: 2}} />}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          estimatedItemSize={200}
          //   ListHeaderComponent={renderHeaderComponent}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
    backgroundColor: colors.food_gray,
  },
  heading: {
    fontSize: 16,
    color: colors.black,
    fontFamily: fontFamily.rubik_semi_bold,
  },
  imageStyle: {
    width: '100%',
    height: screenHeight * 0.28,
    borderRadius: 8,
    backgroundColor: colors.gray,
  },
  imageContainer: {
    width: screenWidth / 2 - 10,
    padding: 4,
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
});
