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
} from 'react-native';
import React, {useState} from 'react';
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
  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.imagePoster}
        source={{uri: routeData?.imagePoster}}
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
});
