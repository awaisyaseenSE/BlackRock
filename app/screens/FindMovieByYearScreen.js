import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Platform,
  StatusBar,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  Button,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import constants from '../constants/constants';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../navigation/navigationStrings';
import ScreenComponent from '../components/ScreenComponent';
import TextInputWithLeftIconCompo from '../components/TextInputWithLeftIconCompo';
import LottieView from 'lottie-react-native';
import ButtonComponent from '../components/ButtonComponent';
import MyIndicator from '../components/MyIndicator';
import MovieDetailComponent from '../components/MovieDetailComponent';
import TopCompoWithHeading from '../components/TopCompoWithHeading';
import {getResponsiveHeight} from '../utils/getResponsiveMarginPadding';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function FindMovieByYearScreen() {
  const [movies, setMovies] = useState([]);
  const [nextPageLink, setNextPageLink] = useState('');
  const [year, setYear] = useState(2001);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [isUrlNull, setIsUrlNull] = useState(false);
  const [searchText, setSearchText] = useState('');

  const fetchMovies = async () => {
    // const url =
    //   nextPageLink !== ''
    //     ? nextPageLink?.replace('http://', 'https://')
    //     : `https://moviesminidatabase.p.rapidapi.com/movie/byYear/${year}`;
    const url =
      nextPageLink !== ''
        ? nextPageLink?.replace('http://', 'https://')
        : nextPageLink == null || nextPageLink == undefined
        ? null
        : `https://moviesminidatabase.p.rapidapi.com/movie/byYear/${year}`;
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '002c32715dmshd97fa28dbb46d29p102420jsnfddbf1201a7d',
        'X-RapidAPI-Host': 'moviesminidatabase.p.rapidapi.com',
      },
    };

    if (url == null) {
      setIsUrlNull(true);
      return null;
    }

    try {
      setLoading(true);
      const response = await fetch(url, options);
      if (!response.ok) {
        setLoading(false);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setMovies(prevMovies => [...prevMovies, ...data.results]);
      setNextPageLink(data.links.next);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [year]);

  const handleEndReached = () => {
    if (!isUrlNull && nextPageLink) {
      fetchMovies();
    }
  };

  const data = [
    2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012,
    2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024,
  ];

  const handleDonePress = () => {
    if (searchText.length > 3) {
      let numberSearch = parseInt(searchText);
      if (!isNaN(numberSearch)) {
        setYear(numberSearch);
        setNextPageLink('');
        setMovies([]);
      }
    }
  };

  return (
    <>
      <ScreenComponent style={{backgroundColor: colors.moviesBg}}>
        <TopCompoWithHeading
          title="Find Movie By Year"
          onPress={() => navigation.goBack()}
        />
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          <View style={{flex: 1}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                height: getResponsiveHeight(8),
              }}>
              <TextInputWithLeftIconCompo
                value={searchText}
                onChangeText={text => {
                  if (text.trim().length) {
                    setSearchText(text);
                  } else {
                    setSearchText('');
                  }
                }}
                maxLength={10}
                inputStyle={styles.inputStyle}
                clearIcon={searchText.length > 0 ? 'Clear' : ''}
                onPressClear={() => setSearchText('')}
                placeholder={'Search movies by year'}
                placeholderTextColor="gray"
              />
              {searchText.length > 0 && (
                <View
                  style={{
                    height: '100%',
                    marginLeft: 6,
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: colors.lightBlack,
                      paddingHorizontal: 10,
                      paddingVertical: 10,
                      borderRadius: 8,
                      marginBottom: 12,
                    }}
                    onPress={handleDonePress}>
                    <Text style={styles.btnText}>Done</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <View style={{marginTop: 8, marginBottom: 30, paddingLeft: 8}}>
              <FlatList
                data={data}
                renderItem={({item, index}) => (
                  <TouchableOpacity
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                      marginRight: 12,
                      backgroundColor:
                        item == year ? colors.black : colors.lightBlack,
                      borderRadius: 12,
                    }}
                    onPress={() => {
                      setYear(item);
                      setNextPageLink('');
                      setMovies([]);
                      //   fetchMovies();
                    }}>
                    <Text style={styles.yearText}>{item}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </View>
            <View style={styles.container}>
              <FlatList
                data={movies}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => (
                  <MovieDetailComponent
                    movieId={item?.imdb_id}
                    imageStyle={styles.imageStyle}
                    style={{marginLeft: 0, paddingHorizontal: 4}}
                    textStyle={{width: screenWidth / 2 - 12}}
                  />
                )}
                numColumns={2}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.1}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={<View style={{marginVertical: 12}} />}
                scrollEnabled={false}
              />
            </View>
          </View>
        </ScrollView>
      </ScreenComponent>
      <MyIndicator visible={loading} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 6,
  },
  text: {
    color: colors.white,
    fontFamily: fontFamily.rubik_semi_bold,
    marginVertical: 4,
  },
  imageStyle: {
    width: screenWidth / 2 - 12,
    height: screenHeight * 0.2,
    borderRadius: 12,
  },
  yearText: {
    color: colors.lineColor,
    fontFamily: fontFamily.rubik_semi_bold,
    fontSize: 14,
  },
  inputStyle: {
    backgroundColor: colors.bottomTabBg,
    borderColor: colors.bottomTabBg,
    borderRadius: 24,
    flex: 1,
    alignItems: 'center',
  },
  btnText: {
    color: colors.white,
    fontFamily: fontFamily.rubik_semi_bold,
    fontSize: 12,
  },
});
