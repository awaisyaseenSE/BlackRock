import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import ScreenComponent from '../components/ScreenComponent';
import {useNavigation} from '@react-navigation/native';
import colors from '../styles/colors';
import TopCompoWithHeading from '../components/TopCompoWithHeading';
import ButtonComponent from '../components/ButtonComponent';
import navigationStrings from '../navigation/navigationStrings';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import FastImage from 'react-native-fast-image';
import LoadingComponent from '../components/LoadingComponent';
import YoutubePlayer from 'react-native-youtube-iframe';
import MyIndicator from '../components/MyIndicator';
import constants from '../constants/constants';
import MyIndicatorLoader from '../components/MyIndicatorLoader';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function AboutScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [imagesData, setImagesData] = useState([]);

  let isMounted = false;

  useEffect(() => {
    isMounted = true;
    getImages();
    return () => {
      isMounted = false;
    };
  }, []);

  const getImages = () => {
    try {
      setLoading(true);
      firestore()
        .collection('testingImages')
        .onSnapshot(snap => {
          const allPostData = snap.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
          }));
          setImagesData(allPostData);
        });

      setLoading(false);
    } catch (error) {
      console.log('Error in fetching images from firestore: ', error);
      setLoading(false);
    }
  };

  const renderItem = ({item}) => {
    return (
      <View style={{marginVertical: 10}}>
        <FlatList
          data={item?.imagesUrls}
          renderItem={({item}) => {
            let fastImgLoad = true;
            return (
              <View style={{width: 120, height: 120}}>
                {fastImgLoad && (
                  <View style={styles.loadingImageStyle}>
                    <ActivityIndicator size={'small'} color={colors.gray} />
                  </View>
                )}
                <FastImage
                  source={{uri: item}}
                  style={styles.image}
                  onLoadStart={() => (fastImgLoad = true)}
                  onLoadEnd={() => (fastImgLoad = false)}
                />
              </View>
            );
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={<View style={{marginVertical: 10}} />}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  };

  const getMovie = async () => {
    // const url =
    //   'https://moviesminidatabase.p.rapidapi.com/movie/byContentRating/4.3/';
    // const options = {
    //   method: 'GET',
    //   headers: {
    //     'X-RapidAPI-Key': '002c32715dmshd97fa28dbb46d29p102420jsnfddbf1201a7d',
    //     'X-RapidAPI-Host': 'moviesminidatabase.p.rapidapi.com',
    //   },
    // };

    // try {
    //   const response = await fetch(url, options);
    //   const result = await response.text();
    //   console.log(result);
    // } catch (error) {
    //   console.error(error);
    // }

    // const url =
    //   'https://moviesminidatabase.p.rapidapi.com/series/byKeywords/game/';
    // const options = {
    //   method: 'GET',
    //   headers: {
    //     'X-RapidAPI-Key': '002c32715dmshd97fa28dbb46d29p102420jsnfddbf1201a7d',
    //     'X-RapidAPI-Host': 'moviesminidatabase.p.rapidapi.com',
    //   },
    // };

    // try {
    //   const response = await fetch(url, options);
    //   const result = await response.json();
    //   console.log(result?.results);
    //   console.log(result?.results?.length);
    // } catch (error) {
    //   console.error(error);
    // }

    // const url =
    //   'https://moviesminidatabase.p.rapidapi.com/series/order/byPopularity/';
    // const options = {
    //   method: 'GET',
    //   headers: {
    //     'X-RapidAPI-Key': '002c32715dmshd97fa28dbb46d29p102420jsnfddbf1201a7d',
    //     'X-RapidAPI-Host': 'moviesminidatabase.p.rapidapi.com',
    //   },
    // };

    // try {
    //   const response = await fetch(url, options);
    //   const result = await response.json();
    //   console.log(result?.results);
    //   console.log(result?.results?.length);
    // } catch (error) {
    //   console.error(error);
    // }

    // const url = 'https://ronreiter-meme-generator.p.rapidapi.com/images';
    // const options = {
    //   method: 'GET',
    //   headers: {
    //     'X-RapidAPI-Key': '002c32715dmshd97fa28dbb46d29p102420jsnfddbf1201a7d',
    //     'X-RapidAPI-Host': 'ronreiter-meme-generator.p.rapidapi.com',
    //   },
    // };

    // try {
    //   const response = await fetch(url, options);
    //   const result = await response.text();
    //   console.log(result);
    // } catch (error) {
    //   console.error(error);
    // }

    const url =
      nextPage == ''
        ? 'https://pexelsdimasv1.p.rapidapi.com/v1/search?query=men&locale=en-US&per_page=15&page=1'
        : nextPage.length > 10
        ? nextPage
        : null;
    if (url == null) {
      console.log('url is null ', url);
      return null;
    }
    const options = {
      method: 'GET',
      headers: {
        Authorization: constants.pexelApiKey,
        'X-RapidAPI-Key': '002c32715dmshd97fa28dbb46d29p102420jsnfddbf1201a7d',
        'X-RapidAPI-Host': 'PexelsdimasV1.p.rapidapi.com',
      },
    };

    try {
      setLoading(true);
      console.log('URL is: ', url);
      const response = await fetch(url, options);
      if (!response.ok) {
        setLoading(false);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      if (!!result) {
        setPhotos(prevPhotos => [...prevPhotos, ...result.photos]);
      }
      if (!!result.next_page) {
        setNextPage(result?.next_page);
        console.log('next page link', result?.next_page);
      }
      console.log(result?.photos?.length);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <>
      <ScreenComponent style={{backgroundColor: colors.moviesBg}}>
        <TopCompoWithHeading
          title="About"
          onPress={() => navigation.goBack()}
        />
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <View style={{marginTop: 4}} />

            <FlatList
              data={imagesData}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          </View>
        </ScrollView>
      </ScreenComponent>
      <MyIndicatorLoader visible={loading} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: 10,
  },
  text: {
    fontSize: 20,
    color: colors.lightBlack,
  },
  btn: {
    width: '60%',
    marginBottom: 20,
    alignSelf: 'center',
    borderRadius: 8,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 10,
  },
  pexelsImageStyle: {
    width: screenWidth,
    height: screenHeight * 0.25,
    resizeMode: 'contain',
  },
  loadingImageStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
