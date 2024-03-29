import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  Platform,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import {
  getFontSize,
  getResponsiveMargin,
} from '../utils/getResponsiveMarginPadding';
import {getApi} from '../helper/APICalls';
import constants from '../constants/constants';
import FastImage from 'react-native-fast-image';
import MyIndicator from '../components/MyIndicator';
import navigationStrings from '../navigation/navigationStrings';
import YoutubePlayer from 'react-native-youtube-iframe';
import {ActivityIndicator} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const getYear = date => {
  const dateString = date;
  const year = dateString.split('-')[0];
  return year;
};

export default function DetailMovieScreen({route}) {
  const navigation = useNavigation();
  const routeData = route?.params?.data;
  const insets = useSafeAreaInsets();
  let movieDetails = routeData?.movieDetail;
  const [laoding, setLoading] = useState(false);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [youtubeVideoID, setYoutubeVideoID] = useState('');
  const [youtubeLoading, setYoutubeLoading] = useState(true);
  const [favoriteMovie, setFavoriteMovie] = useState(false);
  const [recommendationsMovies, setRecommendationsMovies] = useState([]);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = firestore()
      .collection('users')
      .doc(auth().currentUser?.uid)
      .onSnapshot(snap => {
        if (snap.exists) {
          var data = snap.data();
          if (data.hasOwnProperty('favMovies')) {
            const isFavorites =
              data.favMovies.includes(movieDetails?.id) || false;
            setFavoriteMovie(isFavorites);
          }
          setLoading(false);
        } else {
          setLoading(false);
        }
      });
    return () => unsubscribe();
  }, []);

  const getSimilarMovies = async () => {
    try {
      let type = movieDetails?.title ? 'movie' : 'tv';
      setLoading(true);
      let res = await getApi(`/${type}/${movieDetails?.id}/similar`);
      if (!!res) {
        setLoading(false);
        let finalData = res?.results;
        setSimilarMovies(finalData);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const getRecommendationMovies = async () => {
    try {
      let type = movieDetails?.title ? 'movie' : 'tv';
      setLoading(true);
      let res = await getApi(`/${type}/${movieDetails?.id}/recommendations`);
      if (!!res) {
        setLoading(false);
        let finalData = res?.results;
        // console.log(
        //   `Total length of Recommendations ${type}: `,
        //   finalData?.length,
        // );
        setRecommendationsMovies(finalData);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getYoutubeVideoLink = async () => {
    // getApi('/movie/157336/videos');
    let type = movieDetails?.title ? 'movie' : 'tv';
    try {
      setLoading(true);
      // let data = await getApi(`/movie/${movieDetails?.id}/videos`);
      let data = await getApi(`/${type}/${movieDetails?.id}/videos`);
      // https://api.themoviedb.org/3/tv/{series_id}/videos

      if (data?.results && data?.results?.length > 0) {
        // Find the trailer video key
        const trailer = data?.results?.find(video =>
          video.type.toLowerCase().includes('trailer'),
        );

        if (trailer) {
          // Construct YouTube URL
          setYoutubeVideoID(trailer?.key);
          // const youtubeUrl = `https://www.youtube.com/watch?v=${trailer.key}`;
          // console.log(youtubeUrl);
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getSimilarMovies();
    getYoutubeVideoLink();
    getRecommendationMovies();
  }, [routeData]);

  const PopularMovieCompo = ({data, id}) => {
    let postURL = `${constants.image_poster_url}${data.backdrop_path}`;
    const [fastImgLoading, setFastImgLoading] = useState(true);
    return (
      <TouchableOpacity
        style={{marginLeft: 12}}
        onPress={() => handleSimilarDetailScreenNavi(data, postURL)}>
        {fastImgLoading && (
          <View style={styles.fastImageLoadingStyle}>
            <ActivityIndicator size={20} color={colors.gray} />
          </View>
        )}
        <FastImage
          // source={{uri: postURL}}
          source={
            postURL.endsWith('null')
              ? {
                  uri: 'https://cdn.cinematerial.com/p/297x/rlhwo8t9/dummy-dutch-movie-poster-md.jpg?v=1456307982',
                }
              : {uri: postURL}
          }
          style={styles.newposterImageStyle}
          onLoadStart={() => setFastImgLoading(true)}
          onLoadEnd={() => setFastImgLoading(false)}
        />
        <Text numberOfLines={1} style={styles.newsubHeading}>
          {data?.title?.length > 18
            ? data?.title.slice(0, 18) + '...'
            : data?.title}
          {data?.name?.length > 18
            ? data?.name.slice(0, 18) + '...'
            : data?.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const handleSimilarDetailScreenNavi = (data, postURL) => {
    let movieDetail = data;
    let imagePoster = postURL;
    navigation.navigate(navigationStrings.Similar_Movie_Detail_Screen, {
      data: {movieDetail, imagePoster},
    });
  };

  const handleAddToFavoriteMovie = async () => {
    const userId = auth()?.currentUser?.uid;
    const movieId = movieDetails?.id;
    if (!userId || !movieId) {
      Alert.alert('Something went wrong.', 'Please try again later!');
      return;
    }
    try {
      const userRef = firestore().collection('users').doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        Alert.alert('user not found!');
        throw new Error('User not found');
        return null;
      }

      const userData = userDoc.data();

      // Ensure favMovies field exists in userData
      if (!userData.hasOwnProperty('favMovies')) {
        // If favMovies doesn't exist, create it as an empty array
        await userRef.set(
          {
            favMovies: [movieId],
          },
          {merge: true},
        );
        // console.log('Favorite movie created and updated successfully');
        return null;
      }

      if (userData.hasOwnProperty('favMovies')) {
        let updatedFavUsersMovies = [...userData.favMovies]; // Create a new array
        if (userData.favMovies.includes(movieId)) {
          updatedFavUsersMovies = updatedFavUsersMovies.filter(
            id => id !== movieId,
          ); // Remove User id
        } else {
          updatedFavUsersMovies.push(movieId); // Add User id
        }
        await userRef.update({favMovies: updatedFavUsersMovies}); // Update the User id
        // console.log('Favorite movie only updated successfully');
      }
    } catch (error) {
      console.log('Error updating favorite movie:', error);
      Alert.alert(
        'Movie is not added.',
        'Something went wrong. Please try again later!',
      );
    }
  };

  return (
    <>
      <ScrollView
        style={{flex: 1, backgroundColor: colors.moviesBg}}
        showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <StatusBar
            backgroundColor={colors.black}
            barStyle={'light-content'}
          />
          <FastImage
            style={styles.imagePoster}
            source={
              routeData?.imagePoster.endsWith('null')
                ? {
                    uri: 'https://cdn.cinematerial.com/p/297x/rlhwo8t9/dummy-dutch-movie-poster-md.jpg?v=1456307982',
                  }
                : {uri: routeData?.imagePoster}
            }
          />
          <TouchableOpacity
            style={[
              styles.iconContainer,
              {top: Platform.OS === 'ios' ? insets.top : 12},
            ]}
            onPress={() => navigation.goBack()}>
            <Image
              source={require('../assets/backward.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
          {movieDetails?.title && (
            <TouchableOpacity
              style={[
                styles.hearticonContainer,
                {
                  top: Platform.OS === 'ios' ? insets.top - 6 : 8,
                },
              ]}
              onPress={() => handleAddToFavoriteMovie()}
              activeOpacity={0.6}>
              <Image
                source={require('../assets/heart-fill.png')}
                style={[
                  styles.hearticon,
                  {
                    tintColor: favoriteMovie
                      ? colors.yellow
                      : colors.LightWhite,
                  },
                ]}
              />
            </TouchableOpacity>
          )}
          <View style={{backgroundColor: colors.moviesBg}}>
            <Text style={styles.heading} selectable>
              {movieDetails?.title} {movieDetails?.name}
            </Text>
            <View style={styles.contentContainer}>
              <Text selectable style={[styles.grayText, {textAlign: 'center'}]}>
                {movieDetails?.release_date
                  ? 'Year ' + getYear(movieDetails?.release_date) + ' - '
                  : ''}
                {movieDetails?.first_air_date
                  ? 'First air date ' +
                    getYear(movieDetails?.first_air_date) +
                    ' - '
                  : ''}
                {movieDetails?.adult ? '18+' : '16+'}
              </Text>
              <Text style={[styles.grayText, {textAlign: 'center'}]}>
                Language {movieDetails?.original_language}
              </Text>
              <Text style={styles.subHeading}>{movieDetails?.overview}</Text>
            </View>
            {youtubeVideoID !== '' && (
              <View style={{alignItems: 'center', width: '100%', height: 220}}>
                {youtubeLoading && (
                  <View style={styles.youtubeLoadingStyle}>
                    <ActivityIndicator size={30} color={colors.gray} />
                  </View>
                )}
                <YoutubePlayer
                  height={220}
                  play={false}
                  videoId={youtubeVideoID}
                  width={'90%'}
                  allowWebViewZoom
                  onReady={() => setYoutubeLoading(false)}
                />
              </View>
            )}

            {recommendationsMovies?.length > 1 && (
              <View style={[styles.newheadingContainer, {marginTop: 12}]}>
                <Text style={styles.newheading}>
                  Recommendated {movieDetails?.title ? 'Movies' : 'Tv Series'}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(
                      navigationStrings.All_Similar_Movies_Screen,
                      {
                        data: recommendationsMovies,
                      },
                    )
                  }>
                  <Text style={[styles.newheading, {color: colors.yellow}]}>
                    See All
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <FlatList
              data={recommendationsMovies}
              renderItem={({item, index}) => (
                <PopularMovieCompo data={item} id={index} />
              )}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              horizontal
            />

            <View style={{marginVertical: 10}} />
            {similarMovies?.length > 1 && (
              <View style={[styles.newheadingContainer, {marginTop: 12}]}>
                <Text style={styles.newheading}>
                  Similar {movieDetails?.title ? 'Movies' : 'Tv Series'}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(
                      navigationStrings.All_Similar_Movies_Screen,
                      {
                        data: similarMovies,
                      },
                    )
                  }>
                  <Text style={[styles.newheading, {color: colors.yellow}]}>
                    See All
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <FlatList
              data={similarMovies}
              renderItem={({item, index}) => (
                <PopularMovieCompo data={item} id={index} />
              )}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              horizontal
            />

            {(similarMovies?.length > 1 ||
              recommendationsMovies?.length > 1) && (
              <View style={{height: 80}} />
            )}
          </View>
        </View>
      </ScrollView>
      <MyIndicator visible={laoding} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: colors.moviesBg,
  },
  imagePoster: {
    width: screenWidth,
    height: screenHeight / 2.2,
    opacity: 0.8,
  },
  topCompo: {
    paddingHorizontal: 20,
  },
  icon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    tintColor: colors.black,
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.LightWhite,
    position: 'absolute',
    top: 10,
    left: 16,
  },
  heading: {
    fontSize: getFontSize(18),
    fontFamily: fontFamily.lato_bold,
    color: colors.LightWhite,
    textAlign: 'center',
    marginVertical: getResponsiveMargin(12),
    paddingHorizontal: 14,
  },
  grayText: {
    fontSize: getFontSize(12),
    fontFamily: fontFamily.rubik_medium,
    color: colors.gray,
    marginBottom: 4,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  subHeading: {
    fontSize: getFontSize(12),
    fontFamily: fontFamily.rubik_medium,
    color: colors.onbordingTextColor,
    marginVertical: 10,
  },
  newheading: {
    fontSize: 16,
    color: colors.LightWhite,
    fontFamily: fontFamily.rubik_medium,
  },
  newheadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  newsubHeading: {
    color: colors.gray,
    fontFamily: fontFamily.rubik_medium,
    fontSize: 12,
    marginTop: 4,
    paddingHorizontal: 4,
    overflow: 'hidden',
    width: screenWidth / 3,
  },
  newposterImageStyle: {
    width: screenWidth / 3,
    height: screenHeight * 0.2,
    borderRadius: 12,
  },
  youtubeLoadingStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hearticonContainer: {
    position: 'absolute',
    top: 10,
    right: 8,
    padding: 8,
  },
  hearticon: {
    width: 26,
    height: 26,
    tintColor: colors.LightWhite,
  },
  fastImageLoadingStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
