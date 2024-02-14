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

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const MovieDetailComponent = ({movieId}) => {
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
      <View style={styles.container}>
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
              style={styles.imageStyle}
            />
            <Text style={styles.title}>
              Title:{' '}
              {movieData?.title?.length > 12
                ? movieData?.title.slice(0, 12) + '...'
                : movieData?.title}
            </Text>
            {/* Add more movie details here */}
          </TouchableOpacity>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              marginTop: 20,
              justifyContent: 'center',
            }}>
            <ActivityIndicator size={'large'} color={colors.blue} />
            <Text
              style={{
                color: colors.darkBlue,
                marginHorizontal: 20,
                fontSize: 20,
              }}>
              Loading...
            </Text>
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 6,
  },
  title: {
    fontSize: 12,
    color: colors.grey,
    fontFamily: fontFamily.rubik_regular,
    marginTop: 4,
  },
  imageStyle: {
    width: screenWidth / 3.5,
    height: screenHeight * 0.2,
    borderRadius: 10,
  },
});

export default MovieDetailComponent;
