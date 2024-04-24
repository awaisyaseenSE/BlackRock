import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import ScreenComponent from '../components/ScreenComponent';
import colors from '../styles/colors';
import TextInputWithLeftIconCompo from '../components/TextInputWithLeftIconCompo';
import constants from '../constants/constants';
import fontFamily from '../styles/fontFamily';
import FastImage from 'react-native-fast-image';

const ItemDetail = ({title = '', icon, value}) => {
  return (
    <View style={styles.itemContainer}>
      <Image source={icon} style={styles.icon} />
      <Text style={styles.itemValueTxt}>{value}</Text>
    </View>
  );
};

export default function WeatherAppHomeScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [searchCity, setSearchCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [fiveDayData, setFiveDayData] = useState([]);

  let citiesData = [
    {
      id: 0,
      name: 'London',
      url: 'https://cdn.pixabay.com/photo/2017/05/18/21/54/london-bridge-2324875_1280.jpg',
    },
    {
      id: 2,
      name: 'New York',
      url: 'https://cdn.pixabay.com/photo/2020/06/16/01/40/buildings-5303864_1280.jpg',
    },
    {
      id: 3,
      name: 'Islamabad',
      url: 'https://w0.peakpx.com/wallpaper/303/135/HD-wallpaper-faisal-masjid-faisalmasjid-islamabad-lights-masjid-mousqu-night-nightview-thumbnail.jpg',
    },
    {
      id: 4,
      name: 'Paris',
      url: 'https://cdn.pixabay.com/photo/2013/04/11/19/46/building-102840_1280.jpg',
    },
    {
      id: 4,
      name: 'Tokyo',
      url: 'https://cdn.pixabay.com/photo/2016/08/16/14/53/travel-1598143_1280.jpg',
    },
    {
      id: 5,
      name: 'Dubai',
      url: 'https://cdn.pixabay.com/photo/2017/04/08/10/42/burj-khalifa-2212978_1280.jpg',
    },
    {
      id: 6,
      name: 'Hong Kong',
      url: 'https://cdn.pixabay.com/photo/2017/06/24/19/47/hong-kong-2438633_1280.jpg',
    },
    {
      id: 7,
      name: 'Bangkok',
      url: 'https://cdn.pixabay.com/photo/2020/02/20/13/25/city-4864747_1280.jpg',
    },
    {
      id: 8,
      name: 'Berlin',
      url: 'https://cdn.pixabay.com/photo/2019/12/07/19/40/building-4679964_1280.jpg',
    },
    {
      id: 9,
      name: 'Beijing',
      url: 'https://cdn.pixabay.com/photo/2022/12/22/02/52/beijing-7671354_1280.jpg',
    },
    {
      id: 10,
      name: 'Los Angeles',
      url: 'https://cdn.pixabay.com/photo/2016/10/25/12/28/los-angeles-1768743_1280.jpg',
    },
  ];

  const getDailyForcastData = async (lat, lon) => {
    if (!lat || !lon) {
      console.log(
        'lat and lon are not given in getDailyForcastData function. lat is: ',
        lat,
        ' Lon is: ',
        lon,
      );
      return null;
    }
    try {
      setLoading(true);
      let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${constants.open_Weather_API_KEY}`;

      let response = await fetch(url);
      if (!response.ok) {
        setLoading(false);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      if (!!result) {
        // console.log('.');
        // console.log('.');
        // console.log('.');
        // console.log('.');
        // console.log('.');
        // console.log(
        //   '.................  data of daily forcast is: ',
        //   result?.list?.length,
        // );
        setFiveDayData(result?.list);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('Error in get Daily Forcast Data: ', error);
    }
  };

  const handleSearchWeatherCity = async (city = '') => {
    try {
      setLoading(true);
      let url = `https://api.openweathermap.org/data/2.5/weather?q=${
        city !== '' ? city : searchCity
      }&appid=${constants.open_Weather_API_KEY}`;
      let response = await fetch(url);
      if (!response.ok) {
        setLoading(false);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      if (!!result) {
        // console.log('data is: ', result);
        setWeatherData(result);
        getDailyForcastData(result?.coord?.lat, result?.coord?.lon);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error == 'Error: HTTP error! Status: 404') {
        // setWeatherData(null);
        Alert.alert(
          `Not found data ${searchCity}`,
          'Make sure to type correct city name!',
        );
      }
      console.log('Error in getting city data: ', error);
      // setWeatherData(null);
    }
  };

  function getTimeFormate(utcTimestamp) {
    const dateObject = new Date(utcTimestamp * 1000);
    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    // const formattedHours = hours % 12 || 12;
    const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  }

  function getDateTimeFromUTCTimestamp(utcTimestamp) {
    const dateObject = new Date(utcTimestamp * 1000);
    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    let finalTime = `${formattedHours} ${ampm}`;

    const timeString = `${hours}:${minutes}`;

    const options = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    const dayString = dateObject.toLocaleDateString(undefined, options);
    const abbreviatedDay = dayString.split(',')[0];
    return `${abbreviatedDay}, ${finalTime}`;
  }

  let iconArray = ['50d', '01n', '13n', '13d', '50n'];

  const renderItem = ({item}) => {
    return (
      <View
        style={{
          marginLeft: 18,
          alignItems: 'center',
          backgroundColor: colors.weather_Search_Bg,
          padding: 12,
          borderRadius: 12,
        }}>
        <Text
          style={[styles.txt, {textTransform: 'capitalize', marginBottom: 4}]}>
          {item?.weather[0]?.description}
        </Text>
        <Text
          style={[
            styles.txt,
            {color: colors.gray, fontSize: 12, marginBottom: 4},
          ]}>
          {getDateTimeFromUTCTimestamp(item?.dt)}
        </Text>
        <FastImage
          source={
            item?.weather[0]?.icon
              ? item?.weather[0]?.icon == '01d'
                ? require('../assets/weather_media/sun.png')
                : item?.weather[0]?.icon == '01n'
                ? require('../assets/weather_media/clear-night-sky.png')
                : item?.weather[0]?.icon == '10d'
                ? require('../assets/weather_media/heavyrain.png')
                : item?.weather[0]?.icon == '10n'
                ? require('../assets/weather_media/night-rain.png')
                : item?.weather[0]?.icon == '03d'
                ? require('../assets/weather_media/scattered-clouds.png')
                : item?.weather[0]?.icon == '03n'
                ? require('../assets/weather_media/scattered-clouds-night.png')
                : item?.weather[0]?.icon == '02d'
                ? require('../assets/weather_media/few-clouds.png')
                : item?.weather[0]?.icon == '02n'
                ? require('../assets/weather_media/few-clouds-night.png')
                : item?.weather[0]?.icon == '04d'
                ? require('../assets/weather_media/broken-clouds.png')
                : item?.weather[0]?.icon == '04n'
                ? require('../assets/weather_media/broken-clouds-night.png')
                : item?.weather[0]?.icon == '50d'
                ? require('../assets/weather_media/mist.png')
                : item?.weather[0]?.icon == '50n'
                ? require('../assets/weather_media/mist.png')
                : item?.weather[0]?.icon == '13d'
                ? require('../assets/weather_media/snow.png')
                : item?.weather[0]?.icon == '13n'
                ? require('../assets/weather_media/snow.png')
                : {
                    uri: `https://openweathermap.org/img/wn/${item?.weather[0]?.icon}@2x.png`,
                  }
              : require('../assets/weather_media/sun.png')
          }
          style={styles.iconStyle2}
          resizeMode="contain"
        />
        <Text style={[styles.txt, {marginTop: 4}]}>
          {(item?.main?.temp - 273).toFixed(0)} &deg; C
        </Text>
      </View>
    );
  };

  const renderItem1 = ({item}) => {
    return (
      <TouchableOpacity
        style={{
          width: 180,
          height: 240,
          marginLeft: 12,
        }}
        activeOpacity={0.8}
        onPress={() => {
          handleSearchWeatherCity(item.name);
        }}>
        <FastImage
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            borderRadius: 12,
          }}
          source={{uri: item?.url}}
        />
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.1)',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={[
              styles.cityNameStyle,
              {backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 22},
            ]}>
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <Image
          source={require('../assets/weather_media/bg.png')}
          style={{width: '100%', height: '100%', position: 'absolute'}}
          blurRadius={70}
        />
        <ScreenComponent>
          <ScrollView
            style={{flex: 1}}
            contentContainerStyle={{flex: 1}}
            showsVerticalScrollIndicator={false}>
            <View style={{flex: 1}}>
              <View style={styles.textInputContainer}>
                <TextInputWithLeftIconCompo
                  value={searchCity}
                  onChangeText={text => {
                    if (text.trim().length) {
                      setSearchCity(text);
                    } else {
                      setSearchCity('');
                    }
                  }}
                  maxLength={30}
                  inputStyle={styles.inputStyle}
                  clearIcon={searchCity.length > 0 ? 'Clear' : ''}
                  onPressClear={() => {
                    setSearchCity('');
                  }}
                  placeholder="Search City"
                  placeholderTextColor={colors.whiteOpacity70}
                  textStyle={{color: colors.LightWhite}}
                  closeIconStyle={{tintColor: colors.LightWhite}}
                  leftIconStyle={{tintColor: colors.LightWhite}}
                  onPress={() => {
                    if (searchCity.length > 1) {
                      handleSearchWeatherCity();
                    }
                  }}
                  loading={loading}
                />
              </View>
              <View style={styles.contentContainer}>
                {weatherData !== null && (
                  <Text
                    style={[
                      styles.cityNameStyle,
                      {
                        alignSelf: 'center',
                        marginVertical: 10,
                      },
                    ]}>
                    {weatherData?.name},{' '}
                    <Text style={{color: colors.whiteOpacity70}}>
                      {weatherData?.sys?.country}
                    </Text>
                  </Text>
                )}
                {weatherData !== null && (
                  <View
                    style={
                      iconArray.includes(weatherData?.weather[0]?.icon)
                        ? styles.iconBg
                        : null
                    }>
                    <FastImage
                      source={
                        weatherData?.weather[0]?.icon
                          ? weatherData?.weather[0]?.icon == '01d'
                            ? require('../assets/weather_media/sun.png')
                            : weatherData?.weather[0]?.icon == '01n'
                            ? require('../assets/weather_media/clear-night-sky.png')
                            : weatherData?.weather[0]?.icon == '10d'
                            ? require('../assets/weather_media/heavyrain.png')
                            : weatherData?.weather[0]?.icon == '10n'
                            ? require('../assets/weather_media/night-rain.png')
                            : weatherData?.weather[0]?.icon == '03d'
                            ? require('../assets/weather_media/scattered-clouds.png')
                            : weatherData?.weather[0]?.icon == '03n'
                            ? require('../assets/weather_media/scattered-clouds-night.png')
                            : weatherData?.weather[0]?.icon == '02d'
                            ? require('../assets/weather_media/few-clouds.png')
                            : weatherData?.weather[0]?.icon == '02n'
                            ? require('../assets/weather_media/few-clouds-night.png')
                            : weatherData?.weather[0]?.icon == '04d'
                            ? require('../assets/weather_media/broken-clouds.png')
                            : weatherData?.weather[0]?.icon == '04n'
                            ? require('../assets/weather_media/broken-clouds-night.png')
                            : weatherData?.weather[0]?.icon == '50d'
                            ? require('../assets/weather_media/mist.png')
                            : weatherData?.weather[0]?.icon == '50n'
                            ? require('../assets/weather_media/mist.png')
                            : weatherData?.weather[0]?.icon == '13d'
                            ? require('../assets/weather_media/snow.png')
                            : weatherData?.weather[0]?.icon == '13n'
                            ? require('../assets/weather_media/snow.png')
                            : {
                                uri: `https://openweathermap.org/img/wn/${weatherData?.weather[0]?.icon}@2x.png`,
                              }
                          : require('../assets/weather_media/sun.png')
                      }
                      style={styles.iconStyle}
                      resizeMode="cover"
                    />
                  </View>
                )}
                {weatherData?.main?.temp && (
                  <Text
                    style={[
                      [
                        styles.cityNameStyle,
                        {alignSelf: 'center', fontSize: 26},
                      ],
                    ]}>
                    {(weatherData?.main?.temp - 273).toFixed(0)} &deg; C
                  </Text>
                )}
                {weatherData?.weather[0]?.description && (
                  <Text
                    style={[
                      [
                        styles.cityNameStyle,
                        {
                          alignSelf: 'center',
                          fontSize: 16,
                          marginTop: 12,
                          color: colors.lightOffWhite,
                          textTransform: 'capitalize',
                        },
                      ],
                    ]}>
                    {weatherData?.weather[0]?.description}
                  </Text>
                )}
                {weatherData !== null && (
                  <View style={styles.weatherDetailContainer}>
                    <View style={styles.row}>
                      <ItemDetail
                        title="Wind"
                        value={
                          Math.floor(weatherData?.wind?.speed * 3.6) + ' km/h'
                        }
                        icon={require('../assets/weather_media/ic_wind.png')}
                      />
                      <ItemDetail
                        title="Humidity"
                        value={weatherData?.main?.humidity + '%'}
                        icon={require('../assets/weather_media/ic_drop.png')}
                      />
                      <ItemDetail
                        title="Sunrise"
                        value={getTimeFormate(weatherData?.sys?.sunrise)}
                        icon={require('../assets/weather_media/ic_sun.png')}
                      />
                    </View>
                  </View>
                )}
                {weatherData !== null && (
                  <View>
                    <View
                      style={{
                        marginBottom: 4,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: 2,
                      }}>
                      <Text style={[styles.txtGray, {flex: 1}]}>
                        Feel Like:{' '}
                        {(weatherData?.main?.feels_like - 273).toFixed(0)} &deg;
                        C
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          flex: 1,
                        }}>
                        <Text style={styles.txtGray}>
                          Min: {(weatherData?.main?.temp_min - 273).toFixed(0)}{' '}
                          &deg; C
                        </Text>
                        <Text style={[styles.txtGray, {marginLeft: 10}]}>
                          Max: {(weatherData?.main?.temp_max - 273).toFixed(0)}{' '}
                          &deg; C
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: colors.weather_Search_Bg,
                        borderStyle: 'dotted',
                      }}
                    />
                    <View
                      style={{
                        marginTop: 6,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                      <Text style={[styles.txtGray, {flex: 1}]}>
                        Pressure: {weatherData?.main?.pressure} hPa
                      </Text>
                      <Text style={[styles.txtGray, {flex: 1}]}>
                        Weather: {weatherData?.weather[0]?.main}
                      </Text>
                    </View>
                    <View
                      style={{
                        marginTop: 6,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                      <Text style={[styles.txtGray, {flex: 1}]}>
                        Sunrise: {getTimeFormate(weatherData?.sys?.sunrise)}
                      </Text>
                      <Text style={[styles.txtGray, {flex: 1}]}>
                        Sunset: {getTimeFormate(weatherData?.sys?.sunset)}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                  marginBottom: 12,
                }}>
                <View>
                  {weatherData !== null && fiveDayData.length > 0 && (
                    <View style={styles.headingContainer}>
                      <Image
                        style={styles.dateIcon}
                        source={require('../assets/ic_datepicker.png')}
                      />
                      <Text style={styles.heading}>Daily forecast</Text>
                    </View>
                  )}
                  {weatherData !== null && fiveDayData.length > 0 && (
                    <FlatList
                      data={fiveDayData}
                      renderItem={renderItem}
                      keyExtractor={(item, index) => index.toString()}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      ListFooterComponent={
                        <View style={{marginHorizontal: 10}} />
                      }
                      ListEmptyComponent={() => (
                        <View>
                          <ActivityIndicator
                            size={'large'}
                            color={colors.LightWhite}
                          />
                        </View>
                      )}
                    />
                  )}
                </View>
              </View>
              {weatherData == null && fiveDayData.length == 0 && (
                <View style={{marginBottom: 14}}>
                  <Text style={styles.famousHeading}>Famous Places</Text>
                  <FlatList
                    data={citiesData}
                    renderItem={renderItem1}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    ListFooterComponent={
                      <View style={{marginHorizontal: 10}} />
                    }
                  />
                </View>
              )}
            </View>
          </ScrollView>
        </ScreenComponent>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInputContainer: {
    alignItems: 'center',
    marginTop: Platform.OS === 'android' ? 14 : 4,
  },
  inputStyle: {
    backgroundColor: colors.weather_Search_Bg,
    borderWidth: 0,
    borderColor: null,
    borderRadius: 22,
    width: '90%',
  },
  cityNameStyle: {
    fontSize: 20,
    color: colors.LightWhite,
    fontFamily: fontFamily.rubik_semi_bold,
  },
  contentContainer: {
    paddingHorizontal: 20,
    // marginTop: 20,
  },
  iconStyle: {
    width: 180,
    height: 180,
    alignSelf: 'center',
  },
  iconBg: {
    backgroundColor: colors.whiteOpacity70,
    alignSelf: 'center',
    borderRadius: 100,
    marginVertical: 14,
    opacity: 0.7,
  },
  txt: {
    fontSize: 14,
    color: colors.LightWhite,
    fontFamily: fontFamily.rubik_medium,
  },
  iconStyle2: {
    width: 60,
    height: 60,
  },
  heading: {
    fontSize: 16,
    color: colors.white,
    fontFamily: fontFamily.rubik_bold,
  },
  headingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 18,
  },
  dateIcon: {
    width: 24,
    height: 24,
    tintColor: colors.lightOffWhite,
    marginRight: 8,
  },
  weatherDetailContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 20,
    marginVertical: 10,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 8,
    tintColor: colors.LightWhite,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  itemValueTxt: {
    color: colors.LightWhite,
    fontFamily: fontFamily.rubik_medium,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  famousHeading: {
    color: colors.LightWhite,
    fontFamily: fontFamily.rubik_bold,
    fontSize: 22,
    marginBottom: 14,
    paddingHorizontal: 20,
  },
  txtGray: {
    color: colors.whiteOpacity70,
    fontFamily: fontFamily.rubik_medium,
    fontSize: 14,
    // flex: 1,
  },
});
