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
import {FlashList} from '@shopify/flash-list';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import MyIndicator from '../components/MyIndicator';
import MovieDetailComponent from '../components/MovieDetailComponent';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function FavoriteMovieScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [favoriteMovieIds, setFavoriteMovieIds] = useState([]);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = firestore()
      .collection('users')
      .doc(auth().currentUser?.uid)
      .onSnapshot(snap => {
        if (snap.exists) {
          var data = snap.data();
          if (data.hasOwnProperty('favMovies')) {
            const isFavorites = data.favMovies;
            setFavoriteMovieIds(isFavorites.reverse());
          }
          setLoading(false);
        } else {
          setLoading(false);
          setFavoriteMovieIds([]);
        }
      });
    return () => unsubscribe();
  }, []);

  const showids = () => {
    console.log('ids: ', favoriteMovieIds);
  };

  return (
    <>
      <ScreenComponent style={{backgroundColor: colors.moviesBg}}>
        <TopCompoWithHeading
          title="Your Favorite Movies"
          onPress={() => navigation.goBack()}
        />
        <View style={styles.container}>
          {favoriteMovieIds.length > 0 && (
            <FlashList
              data={favoriteMovieIds}
              renderItem={({item}) => (
                <MovieDetailComponent
                  movieId={item}
                  imageStyle={styles.imageStyle}
                  style={{marginLeft: 0, paddingHorizontal: 4}}
                  textStyle={{width: screenWidth / 2 - 22, alignSelf: 'center'}}
                />
              )}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => (
                <View style={{marginVertical: 6}} />
              )}
              estimatedItemSize={200}
            />
          )}
        </View>
      </ScreenComponent>
      <MyIndicator visible={loading} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 14,
  },
  imageStyle: {
    width: screenWidth / 2 - 22,
    height: screenHeight * 0.2,
    borderRadius: 12,
  },
});
