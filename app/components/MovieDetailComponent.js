import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import colors from '../styles/colors';
import constants from '../constants/constants';
import FastImage from 'react-native-fast-image';
import fontFamily from '../styles/fontFamily';
import navigationStrings from '../navigation/navigationStrings';
import {useNavigation} from '@react-navigation/native';
import LottieView from 'lottie-react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const MovieDetailComponent = ({movieId, imageStyle, style, textStyle}) => {
  const [movieData, setMovieData] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${constants.theMovieDb_API_KEY}`,
        );
        const data = await response.json();
        setMovieData(data);
      } catch (error) {
        console.error('Error fetching movie data:', error);
      }
    };

    fetchMovieData();
  }, [movieId]);

  const handleNextScreen = () => {
    let postURL = `${constants.image_poster_url}${movieData?.backdrop_path}`;
    let movieDetail = movieData;
    let imagePoster = postURL;
    navigation.navigate(navigationStrings.DETAIL_MOVIE_SCREEN, {
      data: {movieDetail, imagePoster},
    });
  };

  return (
    <>
      <View style={{...styles.container, ...style}}>
        {movieData ? (
          <TouchableOpacity onPress={handleNextScreen}>
            <FastImage
              source={
                movieData?.backdrop_path == undefined ||
                movieData?.backdrop_path == null
                  ? {
                      uri: 'https://cdn.cinematerial.com/p/297x/rlhwo8t9/dummy-dutch-movie-poster-md.jpg?v=1456307982',
                    }
                  : {
                      uri: `${constants.image_poster_url}${movieData?.backdrop_path}`,
                    }
              }
              style={{...styles.imageStyle, ...imageStyle}}
            />
            <Text style={{...styles.title, ...textStyle}} numberOfLines={1}>
              Title:{' '}
              {movieData?.title?.length > 10
                ? movieData?.title.slice(0, 10) + '...'
                : movieData?.title}
            </Text>
          </TouchableOpacity>
        ) : (
          <View
            style={{
              justifyContent: 'center',
              width: screenWidth / 3 - 16,
              height: screenHeight * 0.2,
              alignItems: 'center',
            }}>
            <LottieView
              style={{width: 60, height: 60}}
              source={require('../assets/animation/movie-loading-animation.json')}
              loop={true}
              autoPlay
            />
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginRight: 6,
    marginLeft: 12,
  },
  title: {
    fontSize: 12,
    color: colors.grey,
    fontFamily: fontFamily.rubik_regular,
    marginTop: 4,
    width: screenWidth / 3,
    overflow: 'hidden',
  },
  imageStyle: {
    // width: screenWidth / 3.5,
    // height: screenHeight * 0.2,
    // borderRadius: 10,

    width: screenWidth / 3,
    height: screenHeight * 0.2,
    borderRadius: 12,
  },
});

export default MovieDetailComponent;
