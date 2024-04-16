import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Platform,
  StatusBar,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import constants from '../constants/constants';
import FastImage from 'react-native-fast-image';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import navigationStrings from '../navigation/navigationStrings';
import ScreenComponent from '../components/ScreenComponent';
import TextInputWithLeftIconCompo from '../components/TextInputWithLeftIconCompo';
import TopCompoWithHeading from '../components/TopCompoWithHeading';
import ButtonComponent from '../components/ButtonComponent';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function SearchMultiScreen() {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [searchMovieData, setSearchMovieData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isMovieSelected, setIsMovieSelected] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [endReached, setEndReached] = useState(false);
  const isFocused = useIsFocused();

  // useEffect(() => {
  //   console.log('useEffect is called! and value of isFocused is: ', isFocused);
  //   if (isFocused) {
  //     Alert.alert('Focused!');
  //   }
  // }, [isFocused]);

  const handleSearchMovies = async () => {
    let url = `/search/movie?query=${encodeURIComponent(searchText)}`;
    let tv_url = `/search/tv?query=${encodeURIComponent(searchText)}`;
    let API_URL = `${constants.theMovieDb_BASE_URL}${
      isMovieSelected ? url : tv_url
    }&api_key=${constants.theMovieDb_API_KEY}&page=${currentPage}`;

    let myURL = `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(
      searchText,
    )}&include_adult=false&api_key=${
      constants.theMovieDb_API_KEY
    }&page=${currentPage}`;

    try {
      setLoading(true);
      let response = await fetch(myURL);

      if (!response.ok) {
        setLoading(false);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      let responseData = await response.json();
      let allMoviesData = responseData?.results;
      // console.log('Response data:', allMoviesData?.length);
      if (responseData?.results?.length > 0) {
        // console.log('ALL Movies data is: ', allMoviesData);
        // setSearchMovieData(allMoviesData);
        setSearchMovieData(prevData => [...prevData, ...allMoviesData]);
        setTotalPages(responseData?.total_pages);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error in getting movies for user search:', error);
    }
  };

  const handleEndReached = () => {
    if (currentPage < totalPages && !loading) {
      // Fetch next page of data
      setCurrentPage(prevPage => prevPage + 1);
      handleSearchMovies();
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
    let personURL = `${constants.image_poster_url}${item?.profile_path}`;
    let postURL = `${constants.image_poster_url}${item.backdrop_path}`;
    let fastImgLoading = true;

    return (
      <View
        style={{
          alignItems: 'center',
          paddingHorizontal: 4,
          width: screenWidth / 2 - 4,
          // height: 200,
        }}>
        <TouchableOpacity
          onPress={() => {
            if (item?.media_type == 'person') {
              handleNaviToDetail(item, personURL);
            } else {
              handleNaviToDetail(item, postURL);
            }
          }}>
          {fastImgLoading && (
            <View style={styles.fastImgLoadingStyle}>
              <ActivityIndicator size={20} color={colors.gray} />
            </View>
          )}
          <FastImage
            source={
              postURL?.endsWith('null')
                ? {
                    uri: 'https://cdn.cinematerial.com/p/297x/rlhwo8t9/dummy-dutch-movie-poster-md.jpg?v=1456307982',
                  }
                : {uri: item?.media_type == 'person' ? personURL : postURL}
            }
            style={styles.posterStyle}
            onLoadStart={() => (fastImgLoading = true)}
            onLoadEnd={() => (fastImgLoading = false)}
          />
        </TouchableOpacity>
        <Text style={styles.heading} numberOfLines={1}>
          {item?.title?.length > 18
            ? item?.title.slice(0, 18) + '...'
            : item?.title}
          {item?.name?.length > 18
            ? item?.name.slice(0, 18) + '...'
            : item?.name}
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
          <TopCompoWithHeading
            title="Multi Search"
            onPress={() => navigation.goBack()}
          />
          {/* <ButtonComponent
            title="go to Pixels collection"
            onPress={() =>
              navigation.navigate(navigationStrings.Pexel_Collection_Screen)
            }
          /> */}
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
                    marginBottom: 14,
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
                      marginLeft: 12,
                      paddingHorizontal: 8,
                      paddingVertical: 6,
                    }}
                    onPress={() => {
                      if (!loading) {
                        handleSearchMovies();
                      }
                    }}>
                    {loading ? (
                      <ActivityIndicator
                        animating
                        size={24}
                        color={colors.gray}
                      />
                    ) : (
                      <Image
                        source={require('../assets/check.png')}
                        style={styles.menuIcon}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
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
                    onEndReached={handleEndReached}
                    onEndReachedThreshold={0.5}
                    onMomentumScrollEnd={() => {
                      if (!endReached) {
                        setEndReached(true);
                      }
                    }}
                  />
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
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
    marginBottom: 0,
  },
  posterStyle: {
    width: screenWidth / 2 - 12,
    height: 200,
    borderRadius: 8,
  },
  laodingStyle: {
    width: 60,
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
  fastImgLoadingStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
