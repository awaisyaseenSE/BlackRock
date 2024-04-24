import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import ScreenComponent from '../components/ScreenComponent';
import colors from '../styles/colors';
import constants from '../constants/constants';
import fontFamily from '../styles/fontFamily';
import FastImage from 'react-native-fast-image';
import TopCompoWithHeading from '../components/TopCompoWithHeading';
import MyIndicatorLoader from '../components/MyIndicatorLoader';
import navigationStrings from '../navigation/navigationStrings';
import TextInputWithLeftIconCompo from '../components/TextInputWithLeftIconCompo';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function SearchNewsScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [newsData, setNewsData] = useState([]);

  const getDateTime = time => {
    if (!time) {
      return null;
    }
    let finalTime;
    const publishedAt = new Date(time);
    const today = new Date();
    if (publishedAt.toDateString() === today.toDateString()) {
      finalTime = publishedAt.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else {
      finalTime = publishedAt.toDateString();
    }
    return finalTime;
  };

  const handleSearchNews = async () => {
    try {
      setLoading(true);
      let url = `https://newsapi.org/v2/everything?q=${searchText}&sortBy=popularity&language=en&apiKey=${constants.news_Api_Org}`;
      let response = await fetch(url);
      if (!response.ok) {
        setLoading(false);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      if (!!result) {
        let data = result?.articles;
        if (data.length > 0) {
          data = data.filter(article => article.content !== '[Removed]');
          setNewsData(data);
        }
        console.log('before filtering: ', result?.articles?.length);
        console.log('after filtering: ', data?.length);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('Error in getting Top Head Line News: ', error);
    }
  };

  useEffect(() => {
    if (searchText !== '') {
      handleSearchNews();
    } else {
      setNewsData([]);
    }
  }, [searchText]);

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.newContainer}
        activeOpacity={0.6}
        onPress={() => {
          navigation.navigate(navigationStrings.Detail_News_Screen, {
            link: item?.url,
          });
        }}>
        <FastImage
          source={{
            uri: item?.urlToImage
              ? item?.urlToImage
              : 'https://wirralview.com/sites/default/files/2022-12/newsupdate_wvimage.jpg',
          }}
          style={styles.imageStyle}
        />
        <View style={styles.newContentContainer}>
          <Text numberOfLines={4} style={styles.newHeadingStyle}>
            {item?.title}
          </Text>
          <View>
            <Text
              style={[styles.timeSyle, {marginBottom: 4}]}
              numberOfLines={1}>
              <Text
                numberOfLines={1}
                style={{fontFamily: fontFamily.rubik_bold}}>
                Source:
              </Text>{' '}
              {item?.source?.name}
            </Text>
            <Text style={styles.timeSyle} numberOfLines={1}>
              {getDateTime(item?.publishedAt)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenComponent style={{backgroundColor: colors.moviesBg}}>
      <TopCompoWithHeading
        title={'Search News'}
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
          placeholder={'Search news'}
          placeholderTextColor="gray"
          autoFocus={true}
          loading={loading}
        />
        <FlatList
          data={newsData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ScreenComponent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputStyle: {
    width: '86%',
    alignSelf: 'center',
    backgroundColor: colors.black,
    borderWidth: 0,
    borderRadius: 22,
  },
  newContainer: {
    marginBottom: 10,
    backgroundColor: colors.weather_Search_Bg,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    flexDirection: 'row',
  },
  newContentContainer: {
    flex: 1,
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 4,
    justifyContent: 'space-between',
  },
  newHeadingStyle: {
    fontFamily: fontFamily.rubik_medium,
    fontSize: 14,
    color: colors.lightOffWhite,
  },
  timeSyle: {
    fontSize: 12,
    color: colors.gray,
    fontFamily: fontFamily.lato_regular,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: colors.LightWhite,
  },
  titleContainer: {
    marginLeft: 12,
    backgroundColor: colors.blue2,
    height: 40,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  imageStyle: {
    width: screenWidth / 3,
    height: screenHeight * 0.16,
    borderRadius: 12,
  },
});
