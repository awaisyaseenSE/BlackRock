import {
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Image,
  Text,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenComponent from '../components/ScreenComponent';
import {getApi} from '../helper/APICalls';
import constants from '../constants/constants';
import FastImage from 'react-native-fast-image';
import colors from '../styles/colors';
import MyIndicator from '../components/MyIndicator';
import Carousel from 'react-native-snap-carousel';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../navigation/navigationStrings';
import TopHomeComponent from '../components/TopHomeComponent';
import fontFamily from '../styles/fontFamily';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

export default function HomeScreen() {
  const [laoding, setLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [movieImages, setMovieImages] = useState([]);
  const navigation = useNavigation();
  const [popularMovies, setPopularMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [latestMovies, setLatestMovies] = useState([]);

  const getMoviesData = () => {
    try {
      let requestOptions = {
        method: 'GET',
        redirect: 'follow',
      };
      let URLwithAPI_key =
        'https://api.themoviedb.org/3/movie/550?api_key=9f2de56397d6a9ae9d096f42d24bbac7';

      fetch(URLwithAPI_key, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    } catch (error) {
      console.log('error in getting data of movie: ', error);
    }
  };

  const getEnglishMovies = () => {
    console.log('....................English Movies data....................');
    setLoading(true);
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ZjJkZTU2Mzk3ZDZhOWFlOWQwOTZmNDJkMjRiYmFjNyIsInN1YiI6IjY1YzVmOGJkMWI3MGFlMDEzMGEyMmE0OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3iba-AfsAroW-AzNhR7GLRGceMGJ9OMiZvydu0h3bXs',
      },
    };

    fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', options)
      .then(response => response.json())
      .then(response => {
        setLoading(false);
        console.log(response);
      })
      .catch(err => {
        setLoading(false);
        console.error(err);
      });
  };

  const getDataFormMB = async () => {
    try {
      setLoading(true);
      let res = await getApi('/discover/movie');
      if (!!res) {
        setLoading(false);
        let finalData = res?.results;
        setMovies(finalData);
        const imgURls = finalData.map(
          data => `${constants.image_poster_url}${data.backdrop_path}`,
        );
        setMovieImages(imgURls);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getTopRatedMovies = async () => {
    try {
      setLoading(true);
      // let res = await getApi('/movie/popular');
      let res = await getApi('/movie/top_rated');
      if (!!res) {
        setLoading(false);
        let finalData = res?.results;
        setPopularMovies(finalData);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getUpComingMovies = async () => {
    try {
      setLoading(true);
      let res = await getApi('/movie/upcoming');
      if (!!res) {
        setLoading(false);
        let finalData = res?.results;
        setUpcomingMovies(finalData);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // movie/latest

  const getLatestMovies = async () => {
    try {
      setLoading(true);
      let res = await getApi('/movie/latest');
      if (!!res) {
        setLoading(false);
        let finalData = res?.results;
        console.log('latest movies is: ', res);
        setLatestMovies(finalData);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getDataFormMB();
    getTopRatedMovies();
    getUpComingMovies();
    getLatestMovies();
  }, []);

  const navigateToNextScreen = (index, item) => {
    let movieDetail = movies[index];
    let imagePoster = item;
    navigation.navigate(navigationStrings.DETAIL_MOVIE_SCREEN, {
      data: {movieDetail, imagePoster},
    });
  };

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity onPress={() => navigateToNextScreen(index, item)}>
        <FastImage source={{uri: item}} style={styles.posterImage} />
      </TouchableOpacity>
    );
  };

  const PopularMovieCompo = ({data, id}) => {
    let postURL = `${constants.image_poster_url}${data.backdrop_path}`;
    let movieDetail = data;
    let imagePoster = postURL;
    const handleNaviToDetail = () => {
      navigation.navigate(navigationStrings.DETAIL_MOVIE_SCREEN, {
        data: {movieDetail, imagePoster},
      });
    };

    return (
      <TouchableOpacity style={{marginLeft: 12}} onPress={handleNaviToDetail}>
        <FastImage source={{uri: postURL}} style={styles.posterImageStyle} />
        <Text numberOfLines={1} style={styles.subHeading}>
          {data?.title?.length > 18
            ? data?.title.slice(0, 18) + '...'
            : data?.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <ScreenComponent style={{backgroundColor: colors.moviesBg}}>
        <StatusBar backgroundColor={colors.black} barStyle={'light-content'} />
        <TopHomeComponent leftOnPress={() => navigation.openDrawer()} />
        <ScrollView
          // contentContainerStyle={{flex: 1}}
          style={{flex: 1}}
          showsVerticalScrollIndicator={false}>
          <View style={{marginBottom: 80}}>
            <Carousel
              data={movieImages}
              renderItem={renderItem}
              sliderWidth={screenWidth}
              itemWidth={screenWidth * 0.62}
              slideStyle={{alignItems: 'center'}}
              firstItem={1}
              inactiveSlideOpacity={0.6}
            />
            <View style={{marginVertical: 18}} />
            <View style={styles.headingContainer}>
              <Text style={styles.heading}>Top Rated</Text>
              <Text style={[styles.heading, {color: colors.yellow}]}>
                See All
              </Text>
            </View>
            <FlatList
              data={popularMovies}
              renderItem={({item, index}) => (
                <PopularMovieCompo data={item} id={index} />
              )}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              horizontal
            />
            <View style={{marginVertical: 18}} />
            <View style={styles.headingContainer}>
              <Text style={styles.heading}>Upcoming</Text>
              <Text style={[styles.heading, {color: colors.yellow}]}>
                See All
              </Text>
            </View>
            <FlatList
              data={upcomingMovies}
              renderItem={({item, index}) => (
                <PopularMovieCompo data={item} id={index} />
              )}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              horizontal
            />

            {/* <View style={{marginVertical: 18}} />
            <View style={styles.headingContainer}>
              <Text style={styles.heading}>Latest</Text>
              <Text style={[styles.heading, {color: colors.yellow}]}>
                See All
              </Text>
            </View>
            <FlatList
              data={latestMovies}
              renderItem={({item, index}) => (
                <PopularMovieCompo data={item} id={index} />
              )}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              horizontal
            /> */}
          </View>
        </ScrollView>
        <MyIndicator visible={laoding} />
      </ScreenComponent>
    </>
  );
}

const styles = StyleSheet.create({
  btn: {
    marginVertical: 12,
    alignSelf: 'center',
    width: '50%',
    borderRadius: 8,
  },
  posterImage: {
    width: screenWidth * 0.58,
    height: screenWidth * 0.84,
    borderRadius: 10,
  },
  subHeading: {
    color: colors.gray,
    fontFamily: fontFamily.rubik_medium,
    fontSize: 12,
    marginTop: 4,
    paddingHorizontal: 4,
    overflow: 'hidden',
  },
  posterImageStyle: {
    width: screenWidth / 3,
    height: screenHeight * 0.2,
    borderRadius: 12,
  },
  heading: {
    fontSize: 16,
    color: colors.LightWhite,
    fontFamily: fontFamily.rubik_medium,
  },
  headingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    marginBottom: 14,
  },
});
