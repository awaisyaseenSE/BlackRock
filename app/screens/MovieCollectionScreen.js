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
import navigationStrings from '../navigation/navigationStrings';
import MyIndicator from '../components/MyIndicator';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function MovieCollectionScreen() {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [searchMovieCollectionData, setSearchMovieCollectionData] = useState(
    [],
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [endReached, setEndReached] = useState(false);

  const handleSearchMoviesCollection = async () => {
    let url = `/search/collection?query=${encodeURIComponent(searchText)}`;
    let API_URL = `${constants.theMovieDb_BASE_URL}${url}&api_key=${constants.theMovieDb_API_KEY}&page=${currentPage}`;
    try {
      setLoading(true);
      let response = await fetch(API_URL);

      if (!response.ok) {
        setLoading(false);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      let responseData = await response.json();
      let allMoviesData = responseData?.results;
      if (responseData?.results?.length > 0) {
        setSearchMovieCollectionData(prevData => [
          ...prevData,
          ...allMoviesData,
        ]);
        setTotalPages(responseData?.total_pages);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error in getting movies for user search:', error);
    }
  };

  useEffect(() => {
    if (searchText !== '') {
      handleSearchMoviesCollection();
    } else {
      setSearchMovieCollectionData([]);
    }
  }, [searchText]);

  const handleEndReached = () => {
    if (currentPage < totalPages && !loading) {
      // Fetch next page of data
      setCurrentPage(prevPage => prevPage + 1);
      handleSearchMoviesCollection();
    }
  };

  const handleNaviToDetail = (movieDetail, imagePoster) => {
    navigation.navigate(navigationStrings.Show_Movie_Collection_Screen, {
      collectionID: movieDetail?.id,
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
          {item?.name?.length > 18
            ? item?.name.slice(0, 18) + '...'
            : item?.name}
        </Text>
      </View>
    );
  };

  return (
    <>
      <ScreenComponent style={{backgroundColor: colors.moviesBg}}>
        <TopCompoWithHeading
          title="Search Movie Collection"
          onPress={() => navigation.goBack()}
        />
        <View style={styles.container}>
          <TextInputWithLeftIconCompo
            value={searchText}
            onChangeText={text => {
              if (text.trim().length) {
                setSearchText(text);
              } else {
                setSearchText('');
              }
            }}
            maxLength={40}
            inputStyle={styles.inputStyle}
            clearIcon={searchText.length > 0 ? 'Clear' : ''}
            onPressClear={() => setSearchText('')}
            placeholder="Search movies collection"
            placeholderTextColor="gray"
          />
          {searchMovieCollectionData.length > 0 && (
            <View style={{paddingHorizontal: 4, flex: 1}}>
              <FlatList
                data={searchMovieCollectionData}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2}
                ItemSeparatorComponent={<View style={{marginVertical: 10}} />}
                showsVerticalScrollIndicator={false}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.5}
                ListFooterComponent={() => {
                  if (endReached) {
                    return null; // No activity indicator if end is reached
                  }

                  return loading ? (
                    <View style={{marginBottom: 50, alignItems: 'center'}}>
                      <LottieView
                        style={styles.laodingStyle}
                        source={require('../assets/animation/movie-loading-animation.json')}
                        loop={true}
                        autoPlay
                      />
                    </View>
                  ) : null;
                }}
                onMomentumScrollEnd={() => {
                  if (!endReached) {
                    setEndReached(true);
                  }
                }}
              />
            </View>
          )}
        </View>
        <MyIndicator visible={loading} />
      </ScreenComponent>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputStyle: {
    backgroundColor: colors.bottomTabBg,
    borderColor: colors.moviesBg,
    borderRadius: 24,
    marginHorizontal: 20,
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
  laodingStyle: {
    width: 60,
    height: 40,
  },
});
