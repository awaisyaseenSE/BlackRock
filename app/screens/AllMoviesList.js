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

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function AllMoviesList({route}) {
  const navigation = useNavigation();
  const moviesIds = route?.params?.moviesIds;

  return (
    <>
      <ScreenComponent style={{backgroundColor: colors.moviesBg}}>
        <View style={styles.container}>
          <TopCompoWithHeading
            title="All Movies List"
            onPress={() => navigation.goBack()}
            titleStyle={{color: colors.LightWhite}}
            backIconStyle={{tintColor: colors.white}}
          />
          <FlatList
            data={moviesIds}
            renderItem={({item}) => <MovieDetailComponent movieId={item?.id} />}
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
    paddingHorizontal: 14,
  },
});
