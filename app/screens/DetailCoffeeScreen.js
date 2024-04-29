import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import navigationStrings from '../navigation/navigationStrings';
import ButtonComponent from '../components/ButtonComponent';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function DetailCoffeeScreen({route}) {
  const data = route?.params?.data;
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [selectedSize, setSelectedSize] = useState(0);
  const [isFav, setIsFav] = useState(false);
  const [noOfCoffee, setNoOfCoffee] = useState(1);

  const handleAddCoffee = (operation = '') => {
    if (operation == 'add') {
      setNoOfCoffee(noOfCoffee + 1);
    } else if (operation == 'remove') {
      if (noOfCoffee !== 0) {
        setNoOfCoffee(noOfCoffee - 1);
      }
    } else {
      return null;
    }
  };

  const handleBuyNow = () => {
    let size =
      selectedSize === 0 ? 'small' : selectedSize === 1 ? 'medium' : 'large';
    let finalData = {...data, size, noOfCoffee};
    navigation.navigate(navigationStrings.Buy_Now_Coffee_Screen, {
      orderData: finalData,
    });
  };

  return (
    <ScrollView
      style={{flex: 1, backgroundColor: colors.coffee_Light_White}}
      showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <StatusBar
          backgroundColor={colors.coffee_Dark_Brown}
          barStyle={'light-content'}
        />
        <Image
          source={require('../assets/coffee/coffee-banner-1.png')}
          style={styles.bannerStyle}
          blurRadius={1}
        />
        <View
          style={[
            styles.row,
            {
              marginTop: Platform.OS === 'ios' ? insets.top : 14,
            },
          ]}>
          <TouchableOpacity
            style={styles.backIconContainer}
            activeOpacity={0.6}
            onPress={() => navigation.goBack()}>
            <Image
              source={require('../assets/back.png')}
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.backIconContainer}
            activeOpacity={0.6}
            onPress={() => setIsFav(!isFav)}>
            <Image
              source={require('../assets/coffee/heart-fill.png')}
              style={[
                styles.backIcon,
                {
                  tintColor: isFav ? colors.red : colors.white,
                },
              ]}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.imageStyle1Conatainer}>
          <FastImage source={{uri: data?.image}} style={styles.imageStyle1} />
        </View>
        <View style={styles.mainContainer}>
          <View style={styles.starConatiner}>
            <Image
              source={require('../assets/coffee/star.png')}
              style={styles.starIcon}
            />
            <Text style={styles.starTxt}>{data?.stars}</Text>
          </View>
          <View style={styles.row2}>
            <Text style={styles.heading}>{data?.name}</Text>
            <Text style={styles.subheading}>$ {data?.price}</Text>
          </View>
          <Text
            style={[
              styles.heading,
              {
                fontFamily: fontFamily.lato_bold,
                fontSize: 18,
                marginBottom: 10,
              },
            ]}>
            Coffee Size
          </Text>
          <View style={styles.row2}>
            <TouchableOpacity
              style={[
                styles.btn,
                {
                  backgroundColor:
                    selectedSize === 0
                      ? colors.coffee_Light_Brown
                      : colors.food_gray,
                },
              ]}
              activeOpacity={0.6}
              onPress={() => setSelectedSize(0)}>
              <Text
                style={[
                  styles.btnTxt,
                  {
                    color:
                      selectedSize === 0
                        ? colors.coffee_Light_White
                        : colors.food_light_black2,
                  },
                ]}>
                Small
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.btn,
                {
                  backgroundColor:
                    selectedSize === 1
                      ? colors.coffee_Light_Brown
                      : colors.food_gray,
                  marginHorizontal: 10,
                },
              ]}
              activeOpacity={0.6}
              onPress={() => setSelectedSize(1)}>
              <Text
                style={[
                  styles.btnTxt,
                  {
                    color:
                      selectedSize === 1
                        ? colors.coffee_Light_White
                        : colors.food_light_black2,
                  },
                ]}>
                Medium
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.btn,
                {
                  backgroundColor:
                    selectedSize === 2
                      ? colors.coffee_Light_Brown
                      : colors.food_gray,
                },
              ]}
              activeOpacity={0.6}
              onPress={() => setSelectedSize(2)}>
              <Text
                style={[
                  styles.btnTxt,
                  {
                    color:
                      selectedSize === 2
                        ? colors.coffee_Light_White
                        : colors.food_light_black2,
                  },
                ]}>
                Large
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{marginTop: 8}}>
            <Text
              style={[
                styles.heading,
                {
                  fontFamily: fontFamily.rubik_medium,
                  fontSize: 18,
                },
              ]}>
              About
            </Text>
            <Text style={styles.descTxt}>{data?.desc}</Text>
          </View>
          <View style={[styles.row2, {marginTop: 20}]}>
            <Text style={styles.volumeTxt}>
              <Text style={{color: colors.gray}}>Volume</Text>{' '}
              {' ' + data?.volume} ml
            </Text>
            <View style={styles.myRow}>
              <TouchableOpacity
                style={styles.insideRow}
                onPress={() => handleAddCoffee('remove')}
                activeOpacity={0.8}>
                <Image
                  source={require('../assets/coffee/minus.png')}
                  style={styles.minusIcon}
                />
              </TouchableOpacity>
              <Text style={styles.myTxt}>{noOfCoffee}</Text>
              <TouchableOpacity
                style={styles.insideRow}
                onPress={() => handleAddCoffee('add')}
                activeOpacity={0.8}>
                <Image
                  source={require('../assets/coffee/plus.png')}
                  style={styles.minusIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={[
              styles.row2,
              {
                marginTop: 10,
                marginBottom: 20,
              },
            ]}>
            <TouchableOpacity
              style={styles.orderIconContainer}
              activeOpacity={0.6}
              onPress={handleBuyNow}>
              <Image
                source={require('../assets/coffee/order.png')}
                style={styles.orderIcon}
              />
            </TouchableOpacity>
            <ButtonComponent
              title="Buy Now"
              style={styles.btn1}
              onPress={() => {
                if (noOfCoffee > 0) {
                  handleBuyNow();
                } else {
                  Alert.alert(
                    'Atleast 1 Coffee is requried!',
                    'Please select atleast one coffee to place order.',
                  );
                }
              }}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.coffee_Light_White,
  },
  orderIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.food_light_black,
  },
  orderIcon: {
    width: 26,
    height: 26,
    tintColor: colors.food_light_black,
  },
  mainContainer: {
    paddingHorizontal: 20,
    marginTop: 14,
  },
  btn: {
    backgroundColor: colors.food_gray,
    flex: 1,
    paddingVertical: 14,
    borderRadius: 22,
    alignItems: 'center',
  },
  btnTxt: {
    fontSize: 14,
    color: colors.food_light_black2,
    fontFamily: fontFamily.rubik_semi_bold,
  },
  bannerStyle: {
    width: screenWidth,
    height: screenHeight / 3,
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: colors.white,
  },
  backIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  imageStyle1: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  imageStyle1Conatainer: {
    alignItems: 'center',
    marginTop: -95,
    shadowColor: colors.coffee_Dark_Brown,
    shadowOpacity: 0.9,
    shadowOffset: {width: 0, height: 40},
    shadowRadius: 30,
    shadowColor: colors.coffee_Dark_Brown,
  },
  starIcon: {
    width: 14,
    height: 14,
    tintColor: colors.white,
    marginRight: 6,
  },
  starConatiner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.coffee_Light_Brown,
    width: '24%',
    paddingVertical: 6,
    justifyContent: 'center',
    borderRadius: 22,
    marginVertical: 12,
  },
  starTxt: {
    color: colors.white,
  },
  heading: {
    fontSize: 20,
    color: colors.black,
    fontFamily: fontFamily.rubik_bold,
  },
  subheading: {
    fontSize: 16,
    color: colors.black,
    fontFamily: fontFamily.rubik_semi_bold,
  },
  row2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: 16,
  },
  descTxt: {
    fontSize: 12,
    fontFamily: fontFamily.rubik_medium,
    color: colors.lightBlack,
    lineHeight: 16,
    marginTop: 8,
  },
  volumeTxt: {
    fontSize: 16,
    color: colors.black,
    fontWeight: '600',
  },
  myRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: 28,
    width: '34%',
  },
  insideRow: {
    width: 30,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  minusIcon: {
    width: 16,
    height: 16,
  },
  myTxt: {
    fontSize: 18,
    color: colors.black,
    fontFamily: fontFamily.rubik_semi_bold,
  },
  btn1: {
    width: '80%',
    backgroundColor: colors.coffee_Light_Brown,
    height: 52,
  },
});