import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Button,
  FlatList,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  Platform,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import TopCompoWithHeading from '../components/TopCompoWithHeading';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import colors from '../styles/colors';
import LinearGradient from 'react-native-linear-gradient';
import fontFamily from '../styles/fontFamily';
import {
  getResponsiveHeight,
  getFontSize,
  getResponsiveMargin,
} from '../utils/getResponsiveMarginPadding';
import {getApi} from '../helper/APICalls';
import constants from '../constants/constants';
import FastImage from 'react-native-fast-image';

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
  const [listMovies, setListMovies] = useState([]);
  const [moviesIds, setMoviesIDs] = useState([]);
  const [latestMovie, setLatestMovie] = useState(null);

  const getDetailByID = ids => {
    const getData = async url => {
      try {
        let res = await getApi(url);
        if (!!res && !!res?.adult) {
          // console.log('res: ', res);
        }
      } catch (error) {
        console.log(error);
      }
    };

    ids.forEach(id => {
      let url = '/movie/' + id;
      getData(url);
    });
  };

  const getListOFMovies = async () => {
    // let url = '866398'
    // https://api.themoviedb.org/3/movie/866398/lists?api_key=9f2de56397d6a9ae9d096f42d24bbac7
    try {
      setLoading(true);
      let url = '/movie/' + movieDetails.id + '/lists';
      let res = await getApi(url);
      if (!!res) {
        setLoading(false);
        let finalData = res?.results;
        setListMovies(finalData);
        let temArr = [];
        finalData.map(ele => temArr.push(ele.id));
        if (temArr.length > 0) {
          getDetailByID(temArr);
        }
      } else {
        setLoading(false);
        console.log('no data');
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getLatestMovies = async () => {
    try {
      setLoading(true);
      let res = await getApi('/movie/latest');
      if (!!res) {
        setLoading(false);
        setLatestMovie(res);
        let url = `${constants.image_poster_url}${res?.production_companies[0]?.logo_path}`;
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getListOFMovies();
    getLatestMovies();
  }, []);

  const PopularMovieCompo = ({data, id}) => {
    let postURL = `${constants.image_poster_url}${data.backdrop_path}`;

    return (
      <TouchableOpacity style={{marginLeft: 12}}>
        <FastImage source={{uri: postURL}} style={styles.newposterImageStyle} />
        <Text numberOfLines={1} style={styles.newsubHeading}>
          {data?.title?.length > 18
            ? data?.title.slice(0, 18) + '...'
            : data?.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.white} barStyle={'light-content'} />
      <ImageBackground
        style={styles.imagePoster}
        source={
          routeData?.imagePoster.endsWith('null')
            ? {
                uri: 'https://cdn.cinematerial.com/p/297x/rlhwo8t9/dummy-dutch-movie-poster-md.jpg?v=1456307982',
              }
            : {uri: routeData?.imagePoster}
        }
        onLoad={() => <ActivityIndicator size={'large'} color={colors.red} />}>
        <View
          style={[
            styles.topCompo,
            {marginTop: Platform.OS === 'android' ? 10 : insets.top - 6},
          ]}>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => navigation.goBack()}>
            <Image
              source={require('../assets/backward.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>
      <LinearGradient
        colors={['transparent', 'rgba(23,23,23,0.8)', 'rgba(23,23,23,0.4)']}
        start={{x: 0.5, y: 0}}
        end={{x: 0.5, y: 1}}
        style={{
          width: screenWidth,
          flex: 1,
        }}>
        <Text style={styles.heading}>{movieDetails?.title}</Text>
        <View style={styles.contentContainer}>
          <Text style={[styles.grayText, {textAlign: 'center'}]}>
            Year {getYear(movieDetails?.release_date)}
            {' - '}
            {movieDetails?.adult ? '18+' : '16+'}
          </Text>
          <Text style={[styles.grayText, {textAlign: 'center'}]}>
            Language {movieDetails?.original_language}
          </Text>
          <Text style={styles.subHeading}>{movieDetails?.overview}</Text>
        </View>

        <View style={{marginVertical: 18}} />
        <View style={styles.newheadingContainer}>
          <Text style={styles.newheading}>Latest Movie</Text>
          <Text style={[styles.newheading, {color: colors.yellow}]}>
            See All
          </Text>
        </View>
        {/* <FlatList
          data={listMovies}
          renderItem={({item, index}) => (
            <PopularMovieCompo data={item} id={index} />
          )}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          horizontal
        /> */}
        {/* <View>
          <FastImage
            source={{
              uri: `${constants.image_poster_url}${latestMovie?.backdrop_path}`,
            }}
            style={{width: 100, height: 100}}
          />
        </View> */}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.moviesBg,
  },
  imagePoster: {
    width: screenWidth,
    height: screenHeight / 2.2,
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
  },
  heading: {
    fontSize: getFontSize(18),
    fontFamily: fontFamily.lato_bold,
    color: colors.LightWhite,
    textAlign: 'center',
    marginVertical: getResponsiveMargin(12),
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
  },
  newposterImageStyle: {
    width: screenWidth / 3,
    height: screenHeight * 0.2,
    borderRadius: 12,
  },
});
