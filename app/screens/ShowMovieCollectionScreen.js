import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenComponent from '../components/ScreenComponent';
import colors from '../styles/colors';
import TopCompoWithHeading from '../components/TopCompoWithHeading';
import LottieView from 'lottie-react-native';
import {useNavigation} from '@react-navigation/native';
import TextInputWithLeftIconCompo from '../components/TextInputWithLeftIconCompo';
import constants from '../constants/constants';
import FastImage from 'react-native-fast-image';
import fontFamily from '../styles/fontFamily';
import {getApi} from '../helper/APICalls';
import navigationStrings from '../navigation/navigationStrings';
import MyIndicator from '../components/MyIndicator';
import {FlashList} from '@shopify/flash-list';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function ShowMovieCollectionScreen({route}) {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const collectionID = route?.params?.collectionID;
  const [collectionData, setCollectionData] = useState([]);

  const handleGetCollectionData = async () => {
    try {
      setLoading(true);
      let URL = `https://api.themoviedb.org/3/collection/${collectionID}?api_key=${constants.theMovieDb_API_KEY}`;
      let response = await fetch(URL);
      if (!response.ok) {
        setLoading(false);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      let data = await response.json();
      if (!!data) {
        setLoading(false);
        setCollectionData(data?.parts);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetCollectionData();
  }, []);

  const handleNaviToDetail = (movieDetail, imagePoster) => {
    navigation.navigate(navigationStrings.DETAIL_MOVIE_SCREEN, {
      data: {movieDetail, imagePoster},
    });
  };

  const renderItem = ({item, index}) => {
    let postURL = `${constants.image_poster_url}${item.backdrop_path}`;
    return (
      <View style={{alignItems: 'center', paddingHorizontal: 4}}>
        <TouchableOpacity onPress={() => handleNaviToDetail(item, postURL)}>
          <FastImage
            source={
              postURL?.endsWith('null')
                ? {
                    uri: 'https://cdn.cinematerial.com/p/297x/rlhwo8t9/dummy-dutch-movie-poster-md.jpg?v=1456307982',
                  }
                : {uri: postURL}
            }
            style={styles.posterStyle}
          />
        </TouchableOpacity>
        <Text style={styles.heading} numberOfLines={1}>
          {item?.title?.length > 18
            ? item?.title.slice(0, 18) + '...'
            : item?.title}
        </Text>
      </View>
    );
  };

  return (
    <>
      <ScreenComponent style={{backgroundColor: colors.moviesBg}}>
        <TopCompoWithHeading
          title="Movie Collection"
          onPress={() => navigation.goBack()}
        />
        <View style={styles.container}>
          <FlashList
            data={collectionData}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2}
            ItemSeparatorComponent={() => <View style={{marginVertical: 10}} />}
            showsVerticalScrollIndicator={false}
            estimatedItemSize={60}
          />
        </View>
        <MyIndicator visible={loading} />
      </ScreenComponent>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 6,
  },
  posterStyle: {
    width: screenWidth / 2 - 12,
    height: 200,
    borderRadius: 8,
  },
  heading: {
    fontSize: 14,
    color: colors.whiteOpacity70,
    fontFamily: fontFamily.rubik_regular,
    marginTop: 6,
    width: screenWidth / 2 - 12,
  },
});
