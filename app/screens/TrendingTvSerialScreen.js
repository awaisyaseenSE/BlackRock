import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  FlatList,
} from 'react-native';
import colors from '../styles/colors';
import constants from '../constants/constants';
import FastImage from 'react-native-fast-image';
import fontFamily from '../styles/fontFamily';
import ScreenComponent from '../components/ScreenComponent';
import TopCompoWithHeading from '../components/TopCompoWithHeading';
import {useNavigation} from '@react-navigation/native';
import MovieDetailComponent from '../components/MovieDetailComponent';
import {getApi} from '../helper/APICalls';
import LottieView from 'lottie-react-native';
import {FlashList} from '@shopify/flash-list';
import TvSeriesDetailComponent from '../components/TvSeriesDetailComponent';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function TrendingTvSerialScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [endReached, setEndReached] = useState(false);
  const [allmoviesIDs, setAllMovieIDs] = useState([]);

  const getChangedMovies = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.themoviedb.org/3/trending/tv/week?api_key=${constants.theMovieDb_API_KEY}&page=${currentPage}`,
      );

      if (!response.ok) {
        setLoading(false);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      let res = await response.json();
      if (!!res) {
        // console.log(res);
        setLoading(false);
        setTotalPages(res?.total_pages);
        setAllMovieIDs(prevData => [...prevData, ...res.results]);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getChangedMovies();
  }, []);

  const handleEndReached = () => {
    if (currentPage < totalPages && !loading) {
      // Fetch next page of data
      setCurrentPage(prevPage => prevPage + 1);
      getChangedMovies();
    }
  };

  return (
    <>
      <ScreenComponent style={{backgroundColor: colors.moviesBg}}>
        <View style={styles.container}>
          <TopCompoWithHeading
            title="Trending Tv Series"
            onPress={() => navigation.goBack()}
            titleStyle={{color: colors.LightWhite}}
            backIconStyle={{tintColor: colors.white}}
          />
          {allmoviesIDs.length > 0 ? (
            <FlashList
              data={allmoviesIDs}
              renderItem={({item}) => (
                <TvSeriesDetailComponent
                  movieId={item?.id}
                  imageStyle={styles.imageStyle}
                  style={{marginLeft: 0, paddingHorizontal: 4}}
                  textStyle={{width: screenWidth / 2 - 20}}
                />
              )}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => (
                <View style={{marginVertical: 6}} />
              )}
              onEndReached={handleEndReached}
              onEndReachedThreshold={0.5}
              ListFooterComponent={() => {
                if (endReached) {
                  return null; // No activity indicator if end is reached
                }

                return loading ? (
                  <View style={{marginBottom: 50, alignItems: 'center'}}>
                    <LottieView
                      style={styles.laodingStyle}
                      source={require('../assets/animation/movie-loading-animation.json')}
                      loop={true}
                      autoPlay
                    />
                  </View>
                ) : null;
              }}
              onMomentumScrollEnd={() => {
                if (!endReached) {
                  setEndReached(true);
                }
              }}
              estimatedItemSize={200}
            />
          ) : (
            <View style={{marginBottom: 50, alignItems: 'center'}}>
              <LottieView
                style={styles.laodingStyle}
                source={require('../assets/animation/movie-loading-animation.json')}
                loop={true}
                autoPlay
              />
            </View>
          )}
        </View>
      </ScreenComponent>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
  },
  imageStyle: {
    width: screenWidth / 2 - 20,
    height: screenHeight * 0.2,
    borderRadius: 12,
  },
  laodingStyle: {
    width: 60,
    height: 40,
  },
});
