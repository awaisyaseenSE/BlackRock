import {
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Text,
  ScrollView,
  FlatList,
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
import MovieDetailComponent from '../components/MovieDetailComponent';
import {ActivityIndicator} from 'react-native';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

export default function HomeScreen() {
  const [laoding, setLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [movieImages, setMovieImages] = useState([]);
  const navigation = useNavigation();
  const [popularMovies, setPopularMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [trandinggMovies, setTrandingMovies] = useState([]);
  const [allChangedMovieIDS, setAllChangedMovieIDS] = useState([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);

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

  // movie/changes

  const getChangedMovies = async () => {
    try {
      setLoading(true);
      let res = await getApi('/movie/changes');
      if (!!res) {
        setLoading(false);
        let finalData = res?.results;
        let myFinalIDs = res?.results;
        setAllChangedMovieIDS(myFinalIDs);
        // setUpcomingMovies(res);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getTrandingMovies = async () => {
    let url = 'https://api.themoviedb.org/3/trending/movie/week';
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.themoviedb.org/3/trending/movie/week?api_key=${constants.theMovieDb_API_KEY}`,
      );

      if (!response.ok) {
        setLoading(false);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      let res = await response.json();
      if (!!res) {
        setLoading(false);
        setTrandingMovies(res?.results);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getNowPlayingMovies = async () => {
    try {
      setLoading(true);
      let res = await getApi('/movie/now_playing');
      if (!!res) {
        setLoading(false);
        let finalData = res?.results;
        setNowPlayingMovies(finalData);
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
    getTrandingMovies();
    getChangedMovies();
    getNowPlayingMovies();
  }, []);

  const navigateToNextScreen = (index, item) => {
    let movieDetail = movies[index];
    let imagePoster = item;
    navigation.navigate(navigationStrings.DETAIL_MOVIE_SCREEN, {
      data: {movieDetail, imagePoster},
    });
  };

  const renderItem = ({item, index}) => {
    let fastImgLoading = true;
    return (
      <TouchableOpacity onPress={() => navigateToNextScreen(index, item)}>
        {fastImgLoading && (
          <View style={styles.fastImgLoadingStyle}>
            <ActivityIndicator animating size={20} color={colors.gray} />
          </View>
        )}
        <FastImage
          source={{uri: item}}
          style={styles.posterImage}
          onLoadStart={() => (fastImgLoading = true)}
          onLoadEnd={() => (fastImgLoading = false)}
        />
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

    let myfastImgLoading = true;

    return (
      <TouchableOpacity style={{marginLeft: 12}} onPress={handleNaviToDetail}>
        {myfastImgLoading && (
          <View style={styles.fastImgLoadingStyle}>
            <ActivityIndicator animating size={20} color={colors.gray} />
          </View>
        )}
        <FastImage
          source={{uri: postURL}}
          style={styles.posterImageStyle}
          onLoadStart={() => (myfastImgLoading = true)}
          onLoadEnd={() => (myfastImgLoading = false)}
        />
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
        <TopHomeComponent
          leftOnPress={() => navigation.openDrawer()}
          rightOnPress={() =>
            navigation.navigate(navigationStrings.SEARCH_SCREEN)
          }
        />
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
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
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(
                    navigationStrings.All_Catogory_Movie_Screen,
                  )
                }>
                <Text style={[styles.heading, {color: colors.yellow}]}>
                  See All
                </Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={popularMovies}
              renderItem={({item, index}) => (
                <PopularMovieCompo data={item} id={index} />
              )}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              // estimatedItemSize={20}
            />
            <View style={{marginVertical: 18}} />
            <View style={styles.headingContainer}>
              <Text style={styles.heading}>Upcoming</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(
                    navigationStrings.All_Catogory_Movie_Screen,
                  )
                }>
                <Text style={[styles.heading, {color: colors.yellow}]}>
                  See All
                </Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={upcomingMovies}
              renderItem={({item, index}) => (
                <PopularMovieCompo data={item} id={index} />
              )}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              // estimatedItemSize={40}
            />

            <View style={{marginVertical: 18}} />
            <View style={styles.headingContainer}>
              <Text style={styles.heading}>Trending</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(
                    navigationStrings.Show_All_Trading_Movies_Screen,
                  )
                }>
                <Text style={[styles.heading, {color: colors.yellow}]}>
                  See All
                </Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={trandinggMovies}
              renderItem={({item, index}) => (
                <PopularMovieCompo data={item} id={index} />
              )}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              // estimatedItemSize={40}
            />

            <View style={{marginVertical: 18}} />
            <View style={styles.headingContainer}>
              <Text style={styles.heading}>All Time</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(navigationStrings.All_Movies_List, {
                    moviesIds: allChangedMovieIDS,
                  })
                }>
                <Text style={[styles.heading, {color: colors.yellow}]}>
                  See All
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{}}>
              <FlatList
                data={
                  allChangedMovieIDS.length > 20
                    ? allChangedMovieIDS.slice(2, 20)
                    : allChangedMovieIDS
                }
                renderItem={({item, index}) => (
                  <MovieDetailComponent movieId={item?.id} />
                )}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                // estimatedItemSize={40}
              />
            </View>

            <View style={{marginVertical: 18}} />
            <View style={styles.headingContainer}>
              <Text style={styles.heading}>Now Playing Movies</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(
                    navigationStrings.Now_Playing_Movies_Screen,
                  )
                }>
                <Text style={[styles.heading, {color: colors.yellow}]}>
                  See All
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{}}>
              <FlatList
                data={
                  nowPlayingMovies.length > 20
                    ? nowPlayingMovies.slice(2, 20)
                    : nowPlayingMovies
                }
                renderItem={({item, index}) => (
                  <MovieDetailComponent movieId={item?.id} />
                )}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                // estimatedItemSize={40}
              />
            </View>
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
    width: screenWidth / 3,
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
