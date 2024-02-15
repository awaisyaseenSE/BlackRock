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

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function SearchScreen() {
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [searchMovieData, setSearchMovieData] = useState([]);

  const handleSearchMovies = async () => {
    let url = `/search/movie?query=${encodeURIComponent(searchText)}`;
    let API_URL = `${constants.theMovieDb_BASE_URL}${url}&api_key=${constants.theMovieDb_API_KEY}`;
    try {
      setLoading(true);
      let response = await fetch(API_URL);

      if (!response.ok) {
        setLoading(false);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      let responseData = await response.json();
      let allMoviesData = responseData?.results;
      console.log('Response data:', allMoviesData?.length);
      if (responseData?.results?.length > 0) {
        setSearchMovieData(allMoviesData);
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
        <Text style={styles.heading}>
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
          <View style={styles.container}>
            <View style={{paddingHorizontal: 20}}>
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
              />
            </View>
            {loading && (
              <View style={{marginVertical: 8, alignItems: 'center'}}>
                <ActivityIndicator size={20} color={colors.blue} />
              </View>
            )}
            {searchMovieData.length > 0 && (
              <View style={{paddingHorizontal: 6}}>
                <FlatList
                  data={searchMovieData}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => index.toString()}
                  numColumns={2}
                  ItemSeparatorComponent={<View style={{marginVertical: 10}} />}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            )}
          </View>
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
  },
  inputStyle: {
    backgroundColor: colors.moviesBg,
    borderColor: colors.moviesBg,
    borderRadius: 24,
  },
  posterStyle: {
    width: screenWidth / 2 - 12,
    height: 200,
    borderRadius: 8,
  },
});
