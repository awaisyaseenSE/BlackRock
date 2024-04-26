import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Platform,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import ScreenComponent from '../components/ScreenComponent';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import navigationStrings from '../navigation/navigationStrings';
import auth from '@react-native-firebase/auth';
import {coffeeCategory, coffeeCategoryItems} from '../utils/coffeeDummyData';
import Carousel from 'react-native-snap-carousel';
import CoffeeCardCompo from '../components/CoffeeCardCompo';
import firestore from '@react-native-firebase/firestore';
import MyIndicatorLoader from '../components/MyIndicatorLoader';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function CoffeeHomeScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [coffeeData, setCoffeeData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getCoffeeData = async () => {
    try {
      setLoading(true);
      firestore()
        .collection('coffee')
        .onSnapshot(snap => {
          const allCoffeeData = snap.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
          }));
          setCoffeeData(allCoffeeData);
        });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('Error in getting coffee data from firestore: ', error);
    }
  };

  useEffect(() => {
    getCoffeeData();
  }, []);

  const renderCoffeCategoryData = ({item}) => {
    return (
      <TouchableOpacity
        style={[
          styles.coffeeCategoryContainer,
          {
            backgroundColor:
              selectedCategory == item?.title
                ? colors.coffee_Light_Brown
                : colors.food_gray,
          },
        ]}
        activeOpacity={0.6}
        onPress={() => setSelectedCategory(item?.title)}>
        <Text
          style={[
            styles.coffeeCategoryTxt,
            {
              color:
                selectedCategory == item?.title ? colors.white : colors.black,
              fontWeight: selectedCategory == item?.title ? '500' : '400',
            },
          ]}>
          {item?.title}
        </Text>
      </TouchableOpacity>
    );
  };

  const handleOnPress = item => {
    navigation.navigate(navigationStrings.Detail_Coffee_Screen, {
      data: item,
    });
  };

  return (
    <>
      <View
        style={[
          styles.container,
          {
            paddingBottom: Platform.OS === 'ios' ? insets.bottom : 30,
          },
        ]}>
        <StatusBar
          backgroundColor={colors.coffee_Dark_Brown}
          barStyle={
            Platform.OS === 'android' ? 'light-content' : 'dark-content'
          }
        />
        <ImageBackground
          style={styles.imgBgStyle}
          source={require('../assets/coffee/coffee-bg-5.jpg')}>
          <View
            style={[
              styles.bannerView,
              {
                paddingTop: Platform.OS === 'ios' ? insets.top : 14,
              },
            ]}>
            <View style={styles.topHeaderContainer}>
              <Image
                source={require('../assets/food/man.png')}
                style={styles.menIcon}
              />
              <Text style={styles.txt}>{auth()?.currentUser?.displayName}</Text>

              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() =>
                  navigation.navigate(navigationStrings.Add_Coffee_Screen)
                }>
                <Image
                  source={require('../assets/add-todo.png')}
                  style={styles.notifiIcon}
                />
              </TouchableOpacity>
            </View>
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
                onPress={() => {}}>
                <Image
                  source={require('../assets/food/search.png')}
                  style={styles.searchIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
        <View style={{marginTop: 14}}>
          <FlatList
            data={coffeeCategory}
            renderItem={renderCoffeCategoryData}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            horizontal
          />
        </View>
        <View style={{marginTop: 40, paddingVertical: 20}}>
          {coffeeData.length > 0 && (
            <Carousel
              data={coffeeData}
              renderItem={({item}) => (
                <CoffeeCardCompo
                  item={item}
                  onPress={() => handleOnPress(item)}
                />
              )}
              contentContainerStyle={{overflow: 'visible'}}
              firstItem={1}
              sliderWidth={screenWidth}
              itemWidth={screenWidth * 0.62}
              slideStyle={{alignItems: 'center'}}
              inactiveSlideOpacity={0.75}
              inactiveSlideScale={0.77}
            />
          )}
        </View>
        <View style={styles.footer}>
          <View style={styles.bottomTabContainer}>
            <TouchableOpacity
              style={[
                styles.bottomTabIconContainer,
                {
                  backgroundColor:
                    selectedTab === 0 ? colors.coffee_Light_White : null,
                },
              ]}
              onPress={() => setSelectedTab(0)}
              activeOpacity={0.8}>
              <Image
                source={require('../assets/coffee/home.png')}
                style={[
                  styles.bottomTabIcon,
                  {
                    tintColor:
                      selectedTab === 0
                        ? colors.coffee_Light_Brown
                        : colors.coffee_Light_White,
                  },
                ]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.bottomTabIconContainer,
                {
                  backgroundColor:
                    selectedTab === 1 ? colors.coffee_Light_White : null,
                },
              ]}
              onPress={() => setSelectedTab(1)}
              activeOpacity={0.8}>
              <Image
                source={
                  selectedTab === 1
                    ? require('../assets/coffee/heart-fill.png')
                    : require('../assets/coffee/heart-empty.png')
                }
                style={[
                  styles.bottomTabIcon,
                  {
                    tintColor:
                      selectedTab === 1
                        ? colors.coffee_Light_Brown
                        : colors.coffee_Light_White,
                  },
                ]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.bottomTabIconContainer,
                {
                  backgroundColor:
                    selectedTab === 2 ? colors.coffee_Light_White : null,
                },
              ]}
              onPress={() => setSelectedTab(2)}
              activeOpacity={0.8}>
              <Image
                source={require('../assets/coffee/order.png')}
                style={[
                  styles.bottomTabIcon,
                  {
                    tintColor:
                      selectedTab === 2
                        ? colors.coffee_Light_Brown
                        : colors.coffee_Light_White,
                  },
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <MyIndicatorLoader visible={loading} color={colors.coffee_Light_Brown} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  bottomTabIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomTabIcon: {
    width: 24,
    height: 24,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomTabContainer: {
    backgroundColor: colors.coffee_Light_Brown,
    borderRadius: 40,
    paddingVertical: 12,
    paddingHorizontal: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    alignSelf: 'center',
  },
  imgBgStyle: {
    width: screenWidth,
    height: screenHeight / 4.5,
  },
  bannerView: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  menIcon: {
    width: 38,
    height: 38,
  },
  txt: {
    fontSize: 15,
    color: colors.black,
    fontFamily: fontFamily.rubik_medium,
  },
  topHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notifiIcon: {
    width: 24,
    height: 24,
    tintColor: colors.black,
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
    marginBottom: 8,
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
    tintColor: colors.whiteOpacity70,
  },
  searchIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.coffee_Light_Brown,
    marginLeft: 6,
  },
  coffeeCategoryContainer: {
    marginLeft: 12,
    backgroundColor: colors.food_gray,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 22,
  },
  coffeeCategoryTxt: {
    fontSize: 14,
    color: colors.black,
    fontWeight: '400',
  },
});
