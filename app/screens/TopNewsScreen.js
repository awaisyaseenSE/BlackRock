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

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function TopNewsScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCatogery] = useState('general');
  const [topHeadingLineData, setTopHeadingLineData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [country, setCountry] = useState('us');
  let countryData = [
    {
      id: 'us',
      name: 'United States',
    },
    {
      id: 'cn',
      name: 'China',
    },
    {
      id: 'ru',
      name: 'Russia',
    },
    {
      id: 'rs',
      name: 'Serbia',
    },
    {
      id: 'in',
      name: 'India',
    },
    {
      id: 'ae',
      name: 'United Arab Emirates (UAE)',
    },
    {
      id: 'ar',
      name: 'Argentina',
    },
    {
      id: 'at',
      name: 'Austria',
    },
    {
      id: 'au',
      name: 'Australia',
    },
    {
      id: 'be',
      name: 'Belgium',
    },
    {
      id: 'ae',
      name: 'Brazil',
    },
    {
      id: 'bg',
      name: 'Bulgaria',
    },
    {
      id: 'ca',
      name: 'Canada',
    },
    {
      id: 'ch',
      name: 'Switzerland',
    },

    {
      id: 'co',
      name: 'Colombia',
    },
    {
      id: 'cu',
      name: 'Cuba',
    },
    {
      id: 'cz',
      name: 'Czech Republic',
    },
    {
      id: 'de',
      name: 'Germany',
    },
    {
      id: 'eg',
      name: 'Egypt',
    },
    {
      id: 'fr',
      name: 'France',
    },
    {
      id: 'gb',
      name: 'United Kingdom',
    },
    {
      id: 'gr',
      name: 'Greece',
    },
    {
      id: 'hk',
      name: 'Hong Kong',
    },
    {
      id: 'hu',
      name: 'Hungary',
    },
    {
      id: 'id',
      name: 'iran',
    },
    {
      id: 'ie',
      name: 'Ireland',
    },
    {
      id: 'il',
      name: 'Israel',
    },

    {
      id: 'it',
      name: 'Itlay',
    },
    {
      id: 'jp',
      name: 'Japan',
    },
    {
      id: 'kr',
      name: 'South Korea',
    },
    {
      id: 'lt',
      name: 'Lithuania',
    },
    {
      id: 'lv',
      name: 'Latvia',
    },
    {
      id: 'ma',
      name: 'Morocco',
    },
    {
      id: 'mx',
      name: 'Mexico',
    },
    {
      id: 'my',
      name: 'Malaysia',
    },
    {
      id: 'ng',
      name: 'Nigeria',
    },
    {
      id: 'nl',
      name: 'Netherlands',
    },
    {
      id: 'no',
      name: 'Norway',
    },
    {
      id: 'nz',
      name: 'New Zealand',
    },
    {
      id: 'ph',
      name: 'Philippines',
    },
    {
      id: 'pl',
      name: 'Poland',
    },
    {
      id: 'ro',
      name: 'Romania',
    },

    {
      id: 'sa',
      name: 'South Africa',
    },
    {
      id: 'se',
      name: 'Sweden',
    },
    {
      id: 'sg',
      name: 'Singapore',
    },
    {
      id: 'si',
      name: 'Slovenia',
    },
    {
      id: 'sk',
      name: 'Slovakia',
    },
    {
      id: 'th',
      name: 'Thailand',
    },
    {
      id: 'tr',
      name: 'Turkey',
    },
    {
      id: 'tw',
      name: 'Taiwan',
    },
    {
      id: 'ua',
      name: 'Ukraine',
    },
    {
      id: 've',
      name: 'Venezuela',
    },
  ];
  let categoryNews = [
    {
      id: 0,
      title: 'general',
    },
    {
      id: 1,
      title: 'entertainment',
    },
    {
      id: 2,
      title: 'business',
    },
    {
      id: 3,
      title: 'health',
    },
    {
      id: 4,
      title: 'science',
    },
    {
      id: 5,
      title: 'sports',
    },
    {
      id: 6,
      title: 'technology',
    },
  ];

  const getTopHeadlines = async () => {
    try {
      setLoading(true);
      let url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${selectedCategory}&apiKey=${constants.news_Api_Org}`;
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
          setTopHeadingLineData(data);
        }
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('Error in getting Top Head Line News: ', error);
    }
  };

  useEffect(() => {
    getTopHeadlines();
  }, [selectedCategory, country]);

  const renderItemCategoryArray = ({item}) => {
    return (
      <TouchableOpacity
        style={[
          styles.titleContainer,
          {
            backgroundColor:
              selectedCategory === item.title ? colors.blue : colors.blue2,
          },
        ]}
        onPress={() => setSelectedCatogery(item.title)}>
        <Text style={styles.titleStyle}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

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

  const renderItemOne = ({item}) => {
    return (
      <TouchableOpacity
        style={{
          marginBottom: 8,
          paddingVertical: 6,
        }}
        onPress={() => setCountry(item?.id)}>
        <Text
          style={[
            styles.txt,
            {
              color:
                country == item?.id ? colors.LightWhite : colors.whiteOpacity70,
              fontSize: country == item?.id ? 16 : 14,
              fontFamily:
                country == item?.id
                  ? fontFamily.rubik_bold
                  : fontFamily.rubik_semi_bold,
            },
          ]}>
          {item?.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <ScreenComponent style={{backgroundColor: colors.moviesBg}}>
        <View style={styles.row}>
          <TopCompoWithHeading
            title={'Top News'}
            onPress={() => navigation.goBack()}
            rightIcon={require('../assets/tab_search.png')}
            onPressRight={() =>
              navigation.navigate(navigationStrings.Search_News_Screen)
            }
            style={{flex: 1}}
          />
          <TouchableOpacity onPress={() => setShowModal(true)}>
            <Image
              source={require('../assets/select_country.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <View style={{height: 42}}>
            <FlatList
              data={categoryNews}
              renderItem={renderItemCategoryArray}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
          <FlatList
            style={{marginTop: 12, paddingHorizontal: 20}}
            data={topHeadingLineData}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScreenComponent>
      {showModal && (
        <Modal visible={showModal} transparent animationType="slide">
          <ScreenComponent style={{backgroundColor: 'rgba(0, 0, 0, 0.6)'}}>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View style={styles.modalView} activeOpacity={1}>
                <TouchableOpacity
                  style={styles.modalCloseIconContainer}
                  onPress={() => setShowModal(false)}>
                  <Image
                    source={require('../assets/close.png')}
                    style={styles.modalCloseIcon}
                  />
                </TouchableOpacity>
                <FlatList
                  data={countryData}
                  renderItem={renderItemOne}
                  keyExtractor={(item, index) => index.toString()}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            </View>
          </ScreenComponent>
        </Modal>
      )}
      <MyIndicatorLoader visible={loading} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleStyle: {
    fontSize: 14,
    fontFamily: fontFamily.rubik_semi_bold,
    color: colors.white,
    textTransform: 'capitalize',
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 12,
  },
  modalView: {
    width: '90%',
    height: screenHeight / 1.8,
    backgroundColor: '#1C2A34',
    // justifyContent: 'center',
    borderRadius: 12,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  modalCloseIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.lineColor,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 8,
    right: 12,
  },
  modalCloseIcon: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
    tintColor: 'gray',
  },
  modalViewContainer: {
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    marginBottom: 14,
  },
  radio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderColor: colors.lineColor,
    borderWidth: 1,
  },
  fillRadio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.blue,
  },
  txt: {
    fontSize: 14,
    fontFamily: fontFamily.rubik_semi_bold,
    color: colors.whiteOpacity70,
    textTransform: 'capitalize',
  },
});
