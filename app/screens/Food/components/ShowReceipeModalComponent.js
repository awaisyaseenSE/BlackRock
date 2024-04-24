import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Image,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenComponent from '../../../components/ScreenComponent';
import colors from '../../../styles/colors';
import fontFamily from '../../../styles/fontFamily';
import FastImage from 'react-native-fast-image';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const ShowReceipeModalComponent = ({
  showModal = false,
  setShowModal,
  setSelectedArea,
  handleGetRecipeByArea,
  setSelectedIngredient,
  handleGetRecipeByIngredient,
}) => {
  const [showCountryList, setShowCountryList] = useState(false);
  const [countryListData, setCountryListData] = useState([]);
  const [ingredientsListData, setIngredientsListData] = useState([]);
  const [showIngredientsList, setShowIngredientsList] = useState(false);

  const getCountryList = async () => {
    try {
      let url = `https://themealdb.com/api/json/v1/1/list.php?a=list`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      if (!!result) {
        setCountryListData(result?.meals);
      }
    } catch (error) {
      console.log('Error in handleExploreRecipe function: ', error);
    }
  };
  const getFoodIngredientsList = async () => {
    try {
      let url = `https://themealdb.com/api/json/v1/1/list.php?i=list`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      if (!!result) {
        setIngredientsListData(result?.meals);
      }
    } catch (error) {
      console.log('Error in handleExploreRecipe function: ', error);
    }
  };

  useEffect(() => {
    getCountryList();
    getFoodIngredientsList();
  }, []);

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.countryContainer}
        activeOpacity={0.6}
        onPress={() => {
          setSelectedArea(item?.strArea);
          handleGetRecipeByArea(item?.strArea);
          setShowModal(false);
        }}>
        <Image
          source={require('../../../assets/food/ic_flag.png')}
          style={styles.icon2}
        />
        <Text style={styles.countryName}>{item?.strArea}</Text>
      </TouchableOpacity>
    );
  };
  const renderItem1 = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.countryContainer}
        activeOpacity={0.6}
        onPress={() => {
          setSelectedIngredient(item?.strIngredient);
          handleGetRecipeByIngredient(item?.strIngredient);
          setShowModal(false);
        }}>
        <FastImage
          source={{
            uri: `https://themealdb.com/images/ingredients/${item?.strIngredient}.png`,
          }}
          style={styles.icon2}
          defaultSource={require('../../../assets/food/ingredients.png')}
        />
        <Text style={styles.countryName}>{item?.strIngredient}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={showModal} transparent animationType="slide">
      <ScreenComponent style={{backgroundColor: 'rgba(0, 0, 0, 0.6)'}}>
        <TouchableOpacity
          style={{flex: 1}}
          onPress={() => setShowModal(false)}
        />
        <View style={styles.container}>
          <View style={styles.topContainer}>
            <TouchableOpacity
              style={styles.closeIconContainer}
              activeOpacity={0.8}
              onPress={() => setShowModal(false)}>
              <Image
                source={require('../../../assets/close.png')}
                style={styles.closeIcon}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.countrySelectContainer}
            activeOpacity={0.8}
            onPress={() => setShowCountryList(!showCountryList)}>
            <Image
              source={require('../../../assets/food/flag.png')}
              style={[styles.icon, {marginRight: 8}]}
            />
            <Text style={styles.heading}>Select Country</Text>
            <Image
              source={
                showCountryList
                  ? require('../../../assets/food/upward-arrow.png')
                  : require('../../../assets/food/downward-arrow.png')
              }
              style={[styles.icon, {marginLeft: 10}]}
            />
          </TouchableOpacity>

          {countryListData.length > 0 && showCountryList && (
            <View style={{flex: 1}}>
              <FlatList
                data={countryListData}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
              />
            </View>
          )}
          <TouchableOpacity
            style={[styles.countrySelectContainer, {marginTop: 10}]}
            activeOpacity={0.8}
            onPress={() => setShowIngredientsList(!showIngredientsList)}>
            <Image
              source={require('../../../assets/food/ingredients.png')}
              style={[styles.icon, {marginRight: 8}]}
            />
            <Text style={styles.heading}>Select Ingradients</Text>
            <Image
              source={
                showIngredientsList
                  ? require('../../../assets/food/upward-arrow.png')
                  : require('../../../assets/food/downward-arrow.png')
              }
              style={[styles.icon, {marginLeft: 10}]}
            />
          </TouchableOpacity>
          {ingredientsListData.length > 0 && showIngredientsList && (
            <View style={{flex: 1}}>
              <FlatList
                data={ingredientsListData}
                renderItem={renderItem1}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
              />
            </View>
          )}
        </View>
        <TouchableOpacity
          style={{flex: 1}}
          onPress={() => setShowModal(false)}
        />
      </ScreenComponent>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: screenHeight / 2,
    backgroundColor: colors.food_gray,
    borderRadius: 12,
    padding: 20,
  },
  closeIcon: {
    width: 12,
    height: 12,
    tintColor: colors.black,
  },
  closeIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.food_Light_yellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',

    marginBottom: 14,
  },
  heading: {
    fontSize: 18,
    fontFamily: fontFamily.lato_bold,
    color: colors.food_light_black2,
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: colors.food_light_black2,
  },
  countrySelectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  countryName: {
    fontSize: 14,
    color: colors.black,
  },
  countryContainer: {
    marginBottom: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.food_Light_yellow,
    paddingHorizontal: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon2: {
    width: 24,
    height: 24,
    tintColor: colors.food_yellow,
    marginRight: 10,
  },
});

export default ShowReceipeModalComponent;
