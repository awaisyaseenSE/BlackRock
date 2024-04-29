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
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenComponent from '../../components/ScreenComponent';
import colors from '../../styles/colors';
import FoodTopHomeCompo from './components/FoodTopHomeCompo';
import auth from '@react-native-firebase/auth';
import fontFamily from '../../styles/fontFamily';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import Animated, {FadeInDown} from 'react-native-reanimated';
import navigationStrings from '../../navigation/navigationStrings';
import ShowReceipeModalComponent from './components/ShowReceipeModalComponent';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function FoodRecipeHomeScreen() {
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Beef');
  const [recipeData, setRecipeData] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [exploreLoading, setExploreLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState('');

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
        setShowSearch(false);
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
        setShowSearch(false);
        setSelectedArea('');
        setSelectedIngredient('');
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('Error in filterCatoryByName fun: ', error);
    }
  };

  const handleSearchReceipe = async () => {
    if (!searchText) {
      return null;
    }
    let url_first_letter = `https://themealdb.com/api/json/v1/1/search.php?f=${searchText}`;
    let url = `https://themealdb.com/api/json/v1/1/search.php?s=${searchText}`;
    let finalUlr = searchText.length == 1 ? url_first_letter : url;
    try {
      setLoading(true);
      const response = await fetch(finalUlr);
      if (!response.ok) {
        setLoading(false);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      if (!!result) {
        console.log('search result: ', result?.meals?.length);
        setSelectedCategory('');
        setRecipeData(result?.meals);
        setShowSearch(true);
        setSelectedArea('');
        setSelectedIngredient('');
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('Error in handle Search Receipe fun: ', error);
    }
  };

  useEffect(() => {
    getFoodCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory !== '') {
      filterCatoryByName();
    }
  }, [selectedCategory]);

  const renderCategories = ({item, index}) => {
    return (
      <TouchableOpacity
        style={[
          styles.categoryImageContainer,
          {
            paddingLeft: index === 0 ? 12 : 0,
          },
        ]}
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
            defaultSource={require('../../assets/food/image.png')}
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
      <Animated.View
        entering={FadeInDown.delay(index * 100)
          .duration(600)
          .springify()
          .damping(12)}>
        <TouchableOpacity
          style={[
            styles.recipeDataContainer,
            {
              paddingLeft: isEven ? 0 : 6,
              paddingRight: isEven ? 6 : 0,
            },
          ]}
          activeOpacity={0.8}
          onPress={() => {
            navigation.navigate(navigationStrings.Detail_Food_Recipe_Screen, {
              data: item,
            });
          }}>
          <FastImage
            source={{uri: item?.strMealThumb}}
            style={[
              styles.recipeDataImage,
              {
                marginTop: index % 3 == 0 ? 20 : 0,
                backgroundColor: colors.food_gray,
              },
            ]}
            defaultSource={require('../../assets/food/picture.png')}
          />
          <Text numberOfLines={1} style={styles.txt}>
            {item?.strMeal}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const handleExploreRecipe = async () => {
    try {
      setExploreLoading(true);
      let url = `https://themealdb.com/api/json/v1/1/random.php`;
      const response = await fetch(url);
      if (!response.ok) {
        setExploreLoading(false);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      if (!!result) {
        setExploreLoading(false);
        let finalData = {
          idMeal: result?.meals[0]?.idMeal,
          strMealThumb: result?.meals[0]?.strMealThumb,
        };
        navigation.navigate(navigationStrings.Detail_Food_Recipe_Screen, {
          data: finalData,
        });
      }
      setExploreLoading(false);
    } catch (error) {
      setExploreLoading(false);
      console.log('Error in handleExploreRecipe function: ', error);
    }
  };

  const handleOnPressFilter = () => {
    setShowModal(!showModal);
  };

  const handleGetRecipeByArea = async area => {
    if (!area) {
      return null;
    }
    try {
      setLoading(true);
      let url = `https://themealdb.com/api/json/v1/1/filter.php?a=${area}`;
      const response = await fetch(url);
      if (!response.ok) {
        setLoading(false);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      if (!!result) {
        setSelectedCategory('');
        setRecipeData(result?.meals);
        setShowSearch(false);
        setSelectedIngredient('');
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('Error in getting Food Categories: ', error);
    }
  };

  const handleGetRecipeByIngredient = async ingredient => {
    if (!ingredient) {
      return null;
    }
    try {
      setLoading(true);
      let url = `https://themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`;
      const response = await fetch(url);
      if (!response.ok) {
        setLoading(false);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      if (!!result) {
        setSelectedCategory('');
        setRecipeData(result?.meals);
        setShowSearch(false);
        setSelectedArea('');
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('Error in getting Food Categories: ', error);
    }
  };

  return (
    <>
      <ScreenComponent
        style={{
          backgroundColor: colors.food_white,
        }}>
        <FoodTopHomeCompo
          onPress={handleExploreRecipe}
          loading={exploreLoading}
          onPressFilter={handleOnPressFilter}
        />
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          <StatusBar
            backgroundColor={colors.food_white}
            barStyle={'dark-content'}
          />
          <TouchableWithoutFeedback
            style={{flex: 1}}
            onPress={() => Keyboard.dismiss()}>
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
                  <TouchableOpacity
                    style={styles.searchIconContainer}
                    onPress={() => {
                      if (searchText.length > 0) {
                        handleSearchReceipe();
                      }
                    }}>
                    <Image
                      source={require('../../assets/food/search.png')}
                      style={styles.searchIcon}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{}}>
                <FlatList
                  data={categoryData}
                  renderItem={renderCategories}
                  keyExtractor={(item, index) => index.toString()}
                  showsHorizontalScrollIndicator={false}
                  horizontal
                />
              </View>
              <View style={{paddingHorizontal: 12, marginTop: 16, flex: 1}}>
                <Text
                  style={[styles.heading, {marginBottom: 10, fontSize: 20}]}>
                  {selectedArea !== '' && selectedArea + ' '}
                  {selectedIngredient !== '' &&
                    selectedIngredient + ' '}Recipes{' '}
                  {showSearch && recipeData?.length > 0
                    ? `(${recipeData?.length})`
                    : ''}
                </Text>
                {loading ? (
                  <ActivityIndicator
                    size={'large'}
                    color={colors.food_yellow}
                  />
                ) : (
                  <FlatList
                    data={recipeData}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                    onEndReachedThreshold={0.1}
                    scrollEnabled={false}
                  />
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
        {showModal && (
          <ShowReceipeModalComponent
            showModal={showModal}
            setShowModal={setShowModal}
            handleGetRecipeByArea={handleGetRecipeByArea}
            setSelectedArea={setSelectedArea}
            setSelectedIngredient={setSelectedIngredient}
            handleGetRecipeByIngredient={handleGetRecipeByIngredient}
          />
        )}
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
    paddingVertical: Platform.OS === 'ios' ? 10 : 2,
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
    borderRadius: 22,
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
