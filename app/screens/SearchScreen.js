import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Platform,
  StatusBar,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import useAuth from '../auth/useAuth';
import constants from '../constants/constants';
import MyIndicator from '../components/MyIndicator';
import FastImage from 'react-native-fast-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../navigation/navigationStrings';
import LoadingComponent from '../components/LoadingComponent';
import TextInputCompo from '../components/TextInputCompo';
import ScreenComponent from '../components/ScreenComponent';
import TextInputWithLeftIconCompo from '../components/TextInputWithLeftIconCompo';
import LottieView from 'lottie-react-native';
import {getResponsiveHeight} from '../utils/getResponsiveMarginPadding';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function SearchScreen() {
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [searchMovieData, setSearchMovieData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isMovieSelected, setIsMovieSelected] = useState(true);

  const handleSearchMovies = async () => {
    let url = `/search/movie?query=${encodeURIComponent(searchText)}`;
    let tv_url = `/search/tv?query=${encodeURIComponent(searchText)}`;
    let API_URL = `${constants.theMovieDb_BASE_URL}${
      isMovieSelected ? url : tv_url
    }&api_key=${constants.theMovieDb_API_KEY}`;
    try {
      setLoading(true);
      let response = await fetch(API_URL);

      if (!response.ok) {
        setLoading(false);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      let responseData = await response.json();
      let allMoviesData = responseData?.results;
      // console.log('Response data:', allMoviesData?.length);
      if (responseData?.results?.length > 0) {
        setSearchMovieData(allMoviesData);
        console.log(responseData);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error in getting movies for user search:', error);
    }
  };

  useEffect(() => {
    if (searchText !== '') {
      handleSearchMovies();
    } else {
      setSearchMovieData([]);
    }
  }, [searchText]);

  const handleNaviToDetail = (movieDetail, imagePoster) => {
    navigation.navigate(navigationStrings.DETAIL_MOVIE_SCREEN, {
      data: {movieDetail, imagePoster},
    });
  };

  const renderItem = ({item, index}) => {
    let postURL = `${constants.image_poster_url}${item.backdrop_path}`;
    return (
      <View style={{alignItems: 'center', paddingHorizontal: 4}}>
        <TouchableOpacity onPress={() => handleNaviToDetail(item, postURL)}>
          <FastImage
            source={
              postURL?.endsWith('null')
                ? {
                    uri: 'https://cdn.cinematerial.com/p/297x/rlhwo8t9/dummy-dutch-movie-poster-md.jpg?v=1456307982',
                  }
                : {uri: postURL}
            }
            style={styles.posterStyle}
          />
        </TouchableOpacity>
        <Text style={styles.heading} numberOfLines={1}>
          {item?.title?.length > 18
            ? item?.title.slice(0, 18) + '...'
            : item?.title}
        </Text>
      </View>
    );
  };

  return (
    <>
      <StatusBar barStyle={'light-content'} backgroundColor={'black'} />
      <LinearGradient
        start={{x: 1, y: 0}}
        end={{x: 0, y: 1}}
        colors={['#313131', '#262626', '#131313']}
        style={{flex: 1}}>
        <ScreenComponent>
          <TouchableWithoutFeedback
            style={{flex: 1}}
            onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>
              <View
                style={{
                  paddingHorizontal: 20,
                  paddingTop: Platform.OS === 'android' ? 10 : 0,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <TextInputWithLeftIconCompo
                    value={searchText}
                    onChangeText={text => {
                      if (text.trim().length) {
                        setSearchText(text);
                      } else {
                        setSearchText('');
                      }
                    }}
                    maxLength={40}
                    inputStyle={styles.inputStyle}
                    clearIcon={searchText.length > 0 ? 'Clear' : ''}
                    onPressClear={() => setSearchText('')}
                    placeholder={
                      isMovieSelected ? 'Search movies' : 'Search tv series'
                    }
                    placeholderTextColor="gray"
                  />
                  <TouchableOpacity
                    style={{
                      // height: getResponsiveHeight(6),
                      alignItems: 'center',
                      marginLeft: 20,
                      justifyContent: 'center',
                    }}
                    onPress={() => setShowModal(true)}>
                    <Image
                      source={require('../assets/menu-burger.png')}
                      style={styles.menuIcon}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {loading && (
                <View style={{marginBottom: 8, alignItems: 'center'}}>
                  <LottieView
                    style={styles.laodingStyle}
                    source={require('../assets/animation/movie-loading-animation.json')}
                    loop={true}
                    autoPlay
                  />
                </View>
              )}
              {searchMovieData.length > 0 && (
                <View style={{paddingHorizontal: 6}}>
                  <FlatList
                    data={searchMovieData}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={2}
                    ItemSeparatorComponent={
                      <View style={{marginVertical: 10}} />
                    }
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={() => (
                      <View style={{marginVertical: 50}} />
                    )}
                  />
                </View>
              )}
              {/* {searchText === '' && (
                <Text style={{color: colors.white}}>Hello EverOne</Text>
              )} */}
            </View>
          </TouchableWithoutFeedback>
          {showModal && (
            <Modal visible={showModal} transparent animationType="slide">
              <ScreenComponent style={{backgroundColor: 'rgba(0, 0, 0, 0.6)'}}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setShowModal(false)}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <View style={styles.modalView}>
                    <TouchableOpacity
                      style={styles.modalCloseIconContainer}
                      onPress={() => setShowModal(false)}>
                      <Image
                        source={require('../assets/close.png')}
                        style={styles.modalCloseIcon}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.modalViewContainer}
                      onPress={() => setIsMovieSelected(true)}>
                      <View
                        style={
                          isMovieSelected === true
                            ? styles.fillRadio
                            : styles.radio
                        }
                      />
                      <Text style={styles.modalText}>Search Movie</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.modalViewContainer}
                      onPress={() => setIsMovieSelected(false)}>
                      <View
                        style={
                          isMovieSelected === false
                            ? styles.fillRadio
                            : styles.radio
                        }
                      />
                      <Text style={styles.modalText}>
                        Search TV Serial Movie
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </ScreenComponent>
            </Modal>
          )}
        </ScreenComponent>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 70,
  },
  heading: {
    fontSize: 14,
    color: colors.whiteOpacity70,
    fontFamily: fontFamily.rubik_regular,
    marginTop: 6,
    width: screenWidth / 2 - 12,
  },
  inputStyle: {
    backgroundColor: colors.moviesBg,
    borderColor: colors.moviesBg,
    borderRadius: 24,
    flex: 1,
    alignItems: 'center',
  },
  posterStyle: {
    width: screenWidth / 2 - 12,
    height: 200,
    borderRadius: 8,
  },
  laodingStyle: {
    width: 40,
    height: 40,
  },
  menuIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: 'gray',
  },
  modalText: {
    fontSize: 16,
    color: colors.LightWhite,
    fontFamily: fontFamily.rubik_semi_bold,
    marginLeft: 14,
  },
  modalCloseIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.lineColor,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 8,
    right: 12,
  },
  modalCloseIcon: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
    tintColor: 'gray',
  },
  modalView: {
    width: '90%',
    height: screenHeight / 4,
    // backgroundColor: colors.black,
    backgroundColor: '#1C2A34',
    // alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  radio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderColor: colors.lineColor,
    borderWidth: 1,
  },
  fillRadio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.blue,
  },
  modalViewContainer: {
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    marginBottom: 14,
  },
});
