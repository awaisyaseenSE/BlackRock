import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import {useNavigation} from '@react-navigation/native';
import ScreenComponent from '../components/ScreenComponent';
import TextInputWithLeftIconCompo from '../components/TextInputWithLeftIconCompo';
import MyIndicator from '../components/MyIndicator';
import MovieDetailComponent from '../components/MovieDetailComponent';
import TopCompoWithHeading from '../components/TopCompoWithHeading';
import {getResponsiveHeight} from '../utils/getResponsiveMarginPadding';
import {FlashList} from '@shopify/flash-list';
import FastImage from 'react-native-fast-image';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function RottonTomatosScreen() {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [moviesData, setMoviesData] = useState([]);

  const fetchMovieDetails = async () => {
    // const url =
    //   'https://ott-details.p.rapidapi.com/advancedsearch?warstart_year=1970&end_year=2024&min_imdb=5&type=movie&sort=latest&page=1';
    const url = `https://ott-details.p.rapidapi.com/search?title=${searchText}`;
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '5f75410f4emshf143142155a6dd7p101489jsn46223137d60a',
        'X-RapidAPI-Host': 'ott-details.p.rapidapi.com',
      },
    };

    try {
      setLoading(true);
      const response = await fetch(url, options);
      const result = await response.json();
      if (!!result) {
        console.log('data results is: ', result?.results?.length);
        // console.log(result);
        setMoviesData(result?.results);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const renderItem = ({item}) => {
    console.log('item data: ', item?.genre);
    console.log('image url: ', item?.imageurl);
    return (
      <View>
        <FastImage
          source={{
            uri: !!item?.imageurl
              ? item?.imageurl[0]
              : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbs_jdVKfNJh-L8biDNPIXL7oggrjQwbw1SiGb1WGWdg&s',
          }}
          style={{
            width: screenWidth / 2 - 10,
            height: 220,
          }}
        />
        <Text>{item?.title}</Text>
      </View>
    );
  };

  return (
    <>
      <ScreenComponent style={{backgroundColor: colors.moviesBg}}>
        <TopCompoWithHeading
          title="Find Movie By Year"
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
            maxLength={10}
            inputStyle={styles.inputStyle}
            clearIcon={searchText.length > 0 ? 'Clear' : ''}
            onPressClear={() => setSearchText('')}
            placeholder={'Search movies'}
            placeholderTextColor="gray"
            onPress={() => {
              if (searchText.length > 0) {
                fetchMovieDetails();
              }
            }}
            loading={loading}
          />
          <FlashList
            data={moviesData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{marginVertical: 12}} />}
            estimatedItemSize={120}
          />
        </View>
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
    borderColor: colors.bottomTabBg,
    borderRadius: 24,
    alignItems: 'center',
    width: '86%',
    alignSelf: 'center',
  },
});
