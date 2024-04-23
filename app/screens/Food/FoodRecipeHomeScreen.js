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
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenComponent from '../../components/ScreenComponent';
import colors from '../../styles/colors';
import FoodTopHomeCompo from './components/FoodTopHomeCompo';
import auth from '@react-native-firebase/auth';
import fontFamily from '../../styles/fontFamily';
import {useNavigation} from '@react-navigation/native';
import CachedImage from '../../utils/CachedImage';
import FastImage from 'react-native-fast-image';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function FoodRecipeHomeScreen() {
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Beef');
  const [recipeData, setRecipeData] = useState([]);

  const getFoodCategories = async () => {
    try {
      setLoading(true);
      let url = 'https://themealdb.com/api/json/v1/1/categories.php';
      const response = await fetch(url);
      if (!response.ok) {
        setLoading(false);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      if (!!result) {
        setCategoryData(result?.categories);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('Error in getting Food Categories: ', error);
    }
  };

  const filterCatoryByName = async () => {
    try {
      setLoading(true);
      let url = `https://themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`;
      const response = await fetch(url);
      if (!response.ok) {
        setLoading(false);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      if (!!result) {
        setRecipeData(result?.meals);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('Error in filterCatoryByName fun: ', error);
    }
  };

  useEffect(() => {
    getFoodCategories();
  }, []);

  useEffect(() => {
    filterCatoryByName();
  }, [selectedCategory]);

  const renderCategories = ({item}) => {
    return (
      <TouchableOpacity
        style={[styles.categoryImageContainer]}
        activeOpacity={0.8}
        onPress={() => setSelectedCategory(item?.strCategory)}>
        <View
          style={[
            styles.categoryImageMainContainer,
            {
              backgroundColor:
                selectedCategory === item?.strCategory
                  ? colors.food_Light_yellow
                  : colors.food_gray,
            },
          ]}>
          <FastImage
            source={{uri: item?.strCategoryThumb}}
            style={[styles.categoryImageStyle]}
          />
        </View>
        <Text
          style={[
            styles.categoryNameTxt,
            {
              color:
                selectedCategory === item?.strCategory
                  ? colors.black
                  : colors.food_light_black,
            },
          ]}>
          {item?.strCategory}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderItem = ({item, index}) => {
    let isEven = index % 2 == 0;
    return (
      <TouchableOpacity
        style={[
          styles.recipeDataContainer,
          {
            paddingLeft: isEven ? 0 : 6,
            paddingRight: isEven ? 6 : 0,
          },
        ]}
        activeOpacity={0.8}>
        <FastImage
          source={{uri: item?.strMealThumb}}
          style={[
            styles.recipeDataImage,
            {
              marginTop: index % 3 == 0 ? 20 : 0,
              backgroundColor: colors.food_gray,
            },
          ]}
        />
        <Text numberOfLines={1} style={styles.txt}>
          {item?.strMeal}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <ScreenComponent style={{backgroundColor: colors.food_white}}>
        <StatusBar
          backgroundColor={colors.lightOffWhite}
          barStyle={'dark-content'}
        />
        <FoodTopHomeCompo />
        <View style={styles.container}>
          <View style={{paddingHorizontal: 20}}>
            <Text style={[styles.subHeading, {marginBottom: 4}]}>
              Hello, {auth()?.currentUser?.displayName}
            </Text>
            <Text style={styles.heading}>
              Make your own food,{'\n'}stay at{' '}
              <Text style={{color: colors.food_Light_yellow}}>home</Text>
            </Text>
            <View style={styles.textInputConatiner}>
              <TextInput
                value={searchText}
                onChangeText={text => {
                  if (text.trim().length) {
                    setSearchText(text);
                  } else {
                    setSearchText('');
                  }
                }}
                maxLength={40}
                style={styles.inputStyle}
                placeholder="Search any recipe"
                placeholderTextColor={colors.food_light_black}
              />
              <TouchableOpacity style={styles.searchIconContainer}>
                <Image
                  source={require('../../assets/food/search.png')}
                  style={styles.searchIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{paddingLeft: 20}}>
            <FlatList
              data={categoryData}
              renderItem={renderCategories}
              keyExtractor={(item, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
              horizontal
            />
          </View>
          <View style={{paddingHorizontal: 12, marginTop: 16, flex: 1}}>
            <Text style={[styles.heading, {marginBottom: 10}]}>Recipes</Text>
            <FlatList
              data={recipeData}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              numColumns={2}
              onEndReachedThreshold={0.1}
            />
          </View>
        </View>
      </ScreenComponent>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    fontSize: 24,
    fontFamily: fontFamily.lato_bold,
    color: colors.food_light_black2,
  },
  subHeading: {
    fontSize: 14,
    fontFamily: fontFamily.lato_regular,
    color: colors.food_light_black2,
  },
  inputStyle: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 10,
    fontSize: 14,
    color: colors.black,
  },
  searchIcon: {
    width: 18,
    height: 18,
    tintColor: colors.food_light_black,
  },
  searchIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    marginLeft: 6,
  },
  textInputConatiner: {
    backgroundColor: colors.food_gray,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderRadius: 22,
    paddingVertical: 10,
    marginTop: 20,
    marginBottom: 14,
  },
  categoryImageStyle: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  categoryImageContainer: {
    marginRight: 16,
    alignItems: 'center',
  },
  categoryImageMainContainer: {
    backgroundColor: colors.food_gray,
    width: 74,
    height: 74,
    borderRadius: 37,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryNameTxt: {
    fontSize: 12,
    fontFamily: fontFamily.rubik_medium,
    color: colors.food_light_black2,
    marginTop: 4,
  },
  recipeDataImage: {
    width: '100%',
    height: screenHeight / 3.5,
    borderRadius: 16,
  },
  recipeDataContainer: {
    width: screenWidth / 2 - 12,
    marginBottom: 8,
  },
  txt: {
    fontSize: 12,
    fontFamily: fontFamily.rubik_semi_bold,
    color: colors.food_light_black2,
    marginTop: 4,
    paddingHorizontal: 4,
  },
});
