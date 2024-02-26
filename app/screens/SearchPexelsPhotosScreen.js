import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import ScreenComponent from '../components/ScreenComponent';
import {useNavigation} from '@react-navigation/native';
import colors from '../styles/colors';
import TopCompoWithHeading from '../components/TopCompoWithHeading';
import navigationStrings from '../navigation/navigationStrings';
import FastImage from 'react-native-fast-image';
import constants from '../constants/constants';
import TextInputWithLeftIconCompo from '../components/TextInputWithLeftIconCompo';
import {Image} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function SearchPexelsPhotosScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [photos, setPhotos] = useState([]);
  const [nextPage, setNextPage] = useState('');
  const perPage = 15;

  const fetchPhotos = async (call, retryCount = 0) => {
    if (nextPage === null) return; // If there are no more pages, don't fetch

    let url;

    if (call == 'btnCall') {
      url = `https://pexelsdimasv1.p.rapidapi.com/v1/search?query=${searchText}&locale=en-US&per_page=${perPage}&page=1`;
    } else {
      url =
        nextPage === ''
          ? `https://pexelsdimasv1.p.rapidapi.com/v1/search?query=${searchText}&locale=en-US&per_page=${perPage}&page=1`
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
        'X-RapidAPI-Key': '002c32715dmshd97fa28dbb46d29p102420jsnfddbf1201a7d',
        'X-RapidAPI-Host': 'PexelsdimasV1.p.rapidapi.com',
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
      setPhotos(prevPhotos => [...prevPhotos, ...result.photos]);
      setNextPage(result.next_page || null);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const renderItem = ({item}) => {
    // console.log(item);
    // console.log('......................');
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(navigationStrings.Detail_Photo_Screen, {
            data: item,
          })
        }
        activeOpacity={0.6}>
        <FastImage
          source={{uri: item?.src?.landscape}}
          style={styles.pexelsImageStyle}
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

  const handleEndReached = () => {
    if (!loading && nextPage !== null && photos.length > 4) {
      fetchPhotos();
    }
  };

  //   useEffect(() => {
  //     if (searchText !== '') {
  //       console.log('useEffect is called');
  //       setPhotos([]);
  //       setNextPage('');
  //       fetchPhotos('btnCall', 0);
  //     } else {
  //       setPhotos([]);
  //       setNextPage(null);
  //     }
  //   }, [searchText]);

  const handleFetchPhotoCall = () => {
    if (searchText.length > 0) {
      setPhotos([]);
      setNextPage('');
      fetchPhotos('btnCall', 0);
    } else {
      setPhotos([]);
      setNextPage(null);
    }
  };

  return (
    <>
      <ScreenComponent style={{backgroundColor: colors.moviesBg}}>
        <TopCompoWithHeading
          title="Search Photos"
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
              setPhotos([]);
              setNextPage('');
            }}
            placeholder="Search Photos..."
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
        <View style={styles.container}>
          <FlatList
            data={photos}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={renderFooter}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.1}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={
              <View style={{height: 4, backgroundColor: colors.bottomTabBg}} />
            }
            // ListHeaderComponent={renderHeader}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    marginBottom: 12,
  },
});
