import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import colors from '../styles/colors';
import constants from '../constants/constants';
import FastImage from 'react-native-fast-image';
import fontFamily from '../styles/fontFamily';
import navigationStrings from '../navigation/navigationStrings';
import {useNavigation} from '@react-navigation/native';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const ShowTvSeriesCompo = ({data}) => {
  let photoURL = `${constants.image_poster_url}${data.backdrop_path}`;
  const navigation = useNavigation();

  const handleNaviToDetailScreen = () => {
    let movieDetail = data;
    let imagePoster = photoURL;
    navigation.navigate(navigationStrings.DETAIL_MOVIE_SCREEN, {
      data: {movieDetail, imagePoster},
    });
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handleNaviToDetailScreen}>
      <FastImage
        source={
          photoURL?.endsWith('null')
            ? {
                uri: 'https://cdn.cinematerial.com/p/297x/rlhwo8t9/dummy-dutch-movie-poster-md.jpg?v=1456307982',
              }
            : {uri: photoURL}
        }
        style={styles.imagePoster}
      />
      <Text numberOfLines={1} style={styles.text}>
        {data?.title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: screenWidth / 2,
    height: screenHeight * 0.3,
    paddingHorizontal: 8,
  },
  imagePoster: {
    height: '90%',
    width: '100%',
    borderRadius: 12,
  },
  text: {
    color: colors.gray,
    fontSize: 12,
    fontFamily: fontFamily.rubik_medium,
    marginTop: 6,
  },
});

export default ShowTvSeriesCompo;
