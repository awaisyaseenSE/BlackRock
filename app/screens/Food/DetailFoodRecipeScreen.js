import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenComponent from '../../components/ScreenComponent';
import colors from '../../styles/colors';
import FoodTopHomeCompo from './components/FoodTopHomeCompo';
import auth from '@react-native-firebase/auth';
import fontFamily from '../../styles/fontFamily';
import {useNavigation} from '@react-navigation/native';
import {CachedImage} from '../../utils/CachedImage';
import FastImage from 'react-native-fast-image';
import Animated, {FadeInDown} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import YoutubePlayer from 'react-native-youtube-iframe';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function DetailFoodRecipeScreen({route}) {
  const recipeData = route?.params?.data;
  const insets = useSafeAreaInsets();
  const [isFav, setIsFav] = useState(false);
  const navigation = useNavigation();
  const [fullData, setFullData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [youtubeLoading, setYoutubeLoading] = useState(true);

  const [showFullText, setShowFullText] = useState(false);

  const toggleShowFullText = () => {
    setShowFullText(!showFullText);
  };

  const getFullData = async () => {
    try {
      if (!recipeData?.idMeal) {
        return null;
      }
      setLoading(true);
      let url = `https://themealdb.com/api/json/v1/1/lookup.php?i=${recipeData?.idMeal}`;
      const response = await fetch(url);
      if (!response.ok) {
        setLoading(false);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      if (!!result) {
        setFullData(result?.meals[0]);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('Error in Detail Food Recipe Screen: ', error);
    }
  };

  useEffect(() => {
    getFullData();
  }, []);

  const ingradientsIndexes = meal => {
    if (!meal) {
      return [];
    }
    let indexs = [];
    for (let i = 0; i < 20; i++) {
      if (meal['strIngredient' + i]) {
        indexs.push(i);
      }
    }
    return indexs;
  };

  return (
    <ScrollView
      style={{flex: 1, backgroundColor: colors.weather_Search_Bg}}
      showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <StatusBar backgroundColor={colors.black} barStyle={'light-content'} />
        <View style={styles.imageContainer}>
          <FastImage
            source={{
              uri: recipeData?.strMealThumb
                ? recipeData?.strMealThumb
                : 'https://cdn.pixabay.com/photo/2023/12/13/17/54/bun-8447394_1280.jpg',
            }}
            style={styles.imageStyle}
          />
          <View
            style={[
              styles.iconsContainer,
              {
                top: Platform.OS === 'ios' ? insets.top : 12,
              },
            ]}>
            <TouchableOpacity
              style={styles.iconContainer}
              activeOpacity={0.6}
              onPress={() => navigation.goBack()}>
              <Image
                source={require('../../assets/backward.png')}
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconContainer}
              activeOpacity={0.6}
              onPress={() => setIsFav(!isFav)}>
              <Image
                source={require('../../assets/heart-fill.png')}
                style={[
                  styles.icon,
                  {
                    tintColor: isFav ? colors.red : colors.gray,
                  },
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>
        {loading && (
          <ActivityIndicator
            size={'large'}
            style={{marginTop: 30}}
            color={colors.food_yellow}
          />
        )}
        {fullData !== null && (
          <View style={styles.contentContainer}>
            <Text style={styles.heading} numberOfLines={1}>
              {fullData?.strMeal}
            </Text>
            <Text style={styles.subheading} numberOfLines={1}>
              {fullData?.strCategory}
            </Text>
            <View style={{}}>
              <Text
                style={[
                  styles.heading,
                  {
                    fontSize: 20,
                    marginBottom: 14,
                    marginTop: 12,
                    fontFamily: fontFamily.rubik_semi_bold,
                    color: colors.food_light_black2,
                  },
                ]}>
                Ingradients
              </Text>
              {ingradientsIndexes(fullData).map(i => {
                return (
                  <View key={i} style={styles.gredientContainer}>
                    <View style={styles.dot} />
                    <View style={styles.row}>
                      <Text style={styles.boldTxt}>
                        {fullData['strMeasure' + i]}
                      </Text>
                      <Text style={styles.ubboldTxt}>
                        {fullData['strIngredient' + i]}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
            <View style={{marginBottom: 14}}>
              <Text style={styles.longTxt}>
                {showFullText
                  ? fullData?.strInstructions
                  : fullData?.strInstructions?.slice(0, 300)}
                {!showFullText && fullData?.strInstructions?.length > 300
                  ? ' ...'
                  : ''}
              </Text>
              {fullData?.strInstructions?.length > 300 && (
                <TouchableOpacity onPress={toggleShowFullText}>
                  <Text style={styles.seeMore}>
                    {showFullText ? 'See less' : 'See more'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <View>
              {fullData?.strYoutube && (
                <Text
                  style={[
                    styles.heading,
                    {
                      fontSize: 18,
                    },
                  ]}>
                  Recipe Video
                </Text>
              )}
              {!!fullData?.strYoutube && (
                <View
                  style={{
                    marginTop: 12,
                    marginBottom: 20,
                    alignItems: 'center',
                    width: '100%',
                    height: 220,
                  }}>
                  {youtubeLoading && (
                    <View style={styles.youtubeLoadingStyle}>
                      <ActivityIndicator size={30} color={colors.red} />
                    </View>
                  )}
                  <YoutubePlayer
                    height={220}
                    play={false}
                    videoId={fullData?.strYoutube}
                    width={'100%'}
                    allowWebViewZoom
                    onReady={() => setYoutubeLoading(false)}
                  />
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.weather_Search_Bg,
  },
  imageContainer: {
    width: '100%',
    height: screenHeight / 2.2,
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    borderBottomRightRadius: 42,
    borderBottomLeftRadius: 42,
  },
  icon: {
    width: 18,
    height: 18,
    tintColor: colors.black,
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.food_white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconsContainer: {
    position: 'absolute',
    top: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  contentContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
    flex: 1,
  },
  heading: {
    fontSize: 22,
    fontFamily: fontFamily.lato_bold,
    color: colors.black,
  },
  subheading: {
    fontSize: 16,
    fontFamily: fontFamily.lato_bold,
    color: colors.lightBlack,
    marginTop: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.food_Light_yellow,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  gredientContainer: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  boldTxt: {
    fontSize: 14,
    fontFamily: fontFamily.rubik_bold,
    color: colors.lightBlack,
    marginRight: 4,
  },
  ubboldTxt: {
    fontSize: 14,
    fontFamily: fontFamily.rubik_semi_bold,
    color: colors.lightBlack,
  },
  longTxt: {
    fontFamily: fontFamily.rubik_regular,
    fontSize: 14,
    color: colors.black,
    textAlign: 'justify',
    lineHeight: 18,
  },
  seeMore: {
    fontSize: 14,
    fontFamily: fontFamily.rubik_bold,
    color: colors.food_yellow,
  },
  youtubeLoadingStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
