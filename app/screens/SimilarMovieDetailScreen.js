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
  ScrollView,
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
import MyIndicator from '../components/MyIndicator';
import YoutubePlayer from 'react-native-youtube-iframe';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const getYear = date => {
  const dateString = date;
  const year = dateString.split('-')[0];
  return year;
};

export default function SimilarMovieDetailScreen({route}) {
  const navigation = useNavigation();
  const routeData = route?.params?.data;
  const insets = useSafeAreaInsets();
  let movieDetails = routeData?.movieDetail;
  const [laoding, setLoading] = useState(false);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [youtubeVideoID, setYoutubeVideoID] = useState('');

  const getYoutubeVideoLink = async () => {
    // getApi('/movie/157336/videos');
    try {
      setLoading(true);
      let data = await getApi(`/movie/${movieDetails?.id}/videos`);

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
    getYoutubeVideoLink();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.black} barStyle={'light-content'} />
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
          {top: Platform.OS === 'android' ? 12 : insets.top - 6},
        ]}
        onPress={() => navigation.goBack()}>
        <Image source={require('../assets/backward.png')} style={styles.icon} />
      </TouchableOpacity>
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
            {movieDetails?.release_date
              ? 'Year ' + getYear(movieDetails?.release_date) + ' - '
              : ''}
            {movieDetails?.adult ? '18+' : '16+'}
          </Text>
          <Text style={[styles.grayText, {textAlign: 'center'}]}>
            Language {movieDetails?.original_language}
          </Text>
          <Text style={styles.subHeading}>{movieDetails?.overview}</Text>
        </View>
        {youtubeVideoID !== '' && (
          <View style={{alignItems: 'center'}}>
            <YoutubePlayer
              height={220}
              play={false}
              videoId={youtubeVideoID}
              width={'90%'}
            />
          </View>
        )}
        <View style={{marginVertical: 10}} />
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
    left: 16,
    top: 10,
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
