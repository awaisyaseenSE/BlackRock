import {View, Text, Button, StyleSheet, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenComponent from '../components/ScreenComponent';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  Value3D,
  withTiming,
} from 'react-native-reanimated';
import ButtonComponent from '../components/ButtonComponent';
import {getApi} from '../helper/APICalls';
import constants from '../constants/constants';
import FastImage from 'react-native-fast-image';
import TopCompoWithHeading from '../components/TopCompoWithHeading';
import colors from '../styles/colors';
import MyIndicator from '../components/MyIndicator';

export default function SearchScreen() {
  const [laoding, setLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [movieImages, setMovieImages] = useState([]);

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

  useEffect(() => {
    getDataFormMB();
  }, []);

  return (
    <>
      <ScreenComponent style={{backgroundColor: colors.onBoardingBg}}>
        <View style={{flex: 1}}>
          <FlatList
            data={movieImages}
            renderItem={({item}) => {
              return (
                <View>
                  <FastImage
                    source={{uri: item}}
                    style={{width: 200, height: 200}}
                  />
                </View>
              );
            }}
          />
        </View>
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
});
