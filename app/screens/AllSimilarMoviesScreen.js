import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React from 'react';
import colors from '../styles/colors';
import ScreenComponent from '../components/ScreenComponent';
import TopCompoWithHeading from '../components/TopCompoWithHeading';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import constants from '../constants/constants';
import fontFamily from '../styles/fontFamily';
import navigationStrings from '../navigation/navigationStrings';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

export default function AllSimilarMoviesScreen({route}) {
  const navigation = useNavigation();
  const routeData = route?.params?.data;

  const ShowMovieCompo = ({data, id}) => {
    let postURL = `${constants.image_poster_url}${data.backdrop_path}`;
    //   console.log(postURL);
    return (
      <TouchableOpacity
        style={{paddingHorizontal: 4}}
        onPress={() => handleSimilarDetailScreenNavi(data, postURL)}>
        <FastImage
          source={
            postURL.endsWith('null')
              ? {
                  uri: 'https://cdn.cinematerial.com/p/297x/rlhwo8t9/dummy-dutch-movie-poster-md.jpg?v=1456307982',
                }
              : {uri: postURL}
          }
          style={styles.newposterImageStyle}
        />
        <Text numberOfLines={1} style={styles.newsubHeading}>
          {data?.title?.length > 10
            ? data?.title.slice(0, 10) + '...'
            : data?.title}
        </Text>
      </TouchableOpacity>
    );
  };

  const handleSimilarDetailScreenNavi = (data, postURL) => {
    let movieDetail = data;
    let imagePoster = postURL;
    navigation.navigate(navigationStrings.DETAIL_MOVIE_SCREEN, {
      data: {movieDetail, imagePoster},
    });
  };

  return (
    <>
      <ScreenComponent style={{backgroundColor: colors.moviesBg}}>
        <StatusBar backgroundColor={colors.black} barStyle={'light-content'} />
        <View style={styles.container}>
          <TopCompoWithHeading
            title="All Similar Movies"
            onPress={() => navigation.goBack()}
            titleStyle={{color: colors.LightWhite}}
            backIconStyle={{tintColor: colors.white}}
          />
          <FlatList
            data={routeData}
            renderItem={({item}) => <ShowMovieCompo data={item} />}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={<View style={{marginVertical: 6}} />}
          />
        </View>
      </ScreenComponent>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.moviesBg,
    paddingHorizontal: 12,
  },
  newsubHeading: {
    color: colors.gray,
    fontFamily: fontFamily.rubik_medium,
    fontSize: 12,
    marginTop: 4,
    paddingHorizontal: 4,
    overflow: 'hidden',
    width: screenWidth / 3 - 14,
  },
  newposterImageStyle: {
    width: screenWidth / 3 - 14,
    height: screenHeight * 0.2,
    borderRadius: 12,
  },
});
