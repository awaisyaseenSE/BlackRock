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
} from 'react-native';
import React, {useState} from 'react';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import ButtonComponent from '../components/ButtonComponent';
import ScreenComponent from '../components/ScreenComponent';
import TopCompoWithHeading from '../components/TopCompoWithHeading';
import ShowAddressModal from '../components/ShowAddressModal';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function BuyNowCoffeeScreen({route}) {
  const orderData = route?.params?.orderData;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [noOfCoffee, setNoOfCoffee] = useState(orderData?.noOfCoffee);
  const [showAdressModal, setShowAdressModal] = useState(false);

  const handleAddCoffee = (operation = '') => {
    if (operation == 'add') {
      setNoOfCoffee(noOfCoffee + 1);
    } else if (operation == 'remove') {
      if (noOfCoffee !== 1) {
        setNoOfCoffee(noOfCoffee - 1);
      }
    } else {
      return null;
    }
  };

  return (
    <>
      <ScreenComponent
        style={{backgroundColor: colors.coffee_Light_White}}
        content={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
        backgroundColor={colors.coffee_Dark_Brown}>
        <TopCompoWithHeading
          title="Checkout"
          titleStyle={{color: colors.black}}
          backIconStyle={{tintColor: colors.black}}
          onPress={() => navigation.goBack()}
        />
        <View style={styles.container}>
          <View style={styles.row}>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.imgContainer}>
                <FastImage
                  source={{uri: orderData?.image}}
                  style={styles.img}
                />
              </View>
              <View style={styles.orderNameContainer}>
                <View>
                  <Text style={styles.nameStyle}>{orderData?.name}</Text>
                  <Text style={styles.priceStyle}>$ {orderData?.price}</Text>
                </View>
                <Text
                  style={[
                    styles.priceStyle,
                    {
                      fontFamily: fontFamily.rubik_bold,
                      fontSize: 16,
                      textTransform: 'capitalize',
                    },
                  ]}>
                  {orderData?.size}
                </Text>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
              }}>
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
          </View>
          <View
            style={[
              styles.totalPriceContainer,
              {
                paddingHorizontal: 4,
                marginHorizontal: 22,
                paddingVertical: 10,
              },
            ]}>
            <Image
              source={require('../assets/coffee/cash-on-delivery.png')}
              style={{width: 34, height: 34}}
            />
            <Text
              style={[
                styles.subHeading,
                {
                  color: colors.coffee_Dark_Brown,
                },
              ]}>
              COD <Text style={{fontSize: 12}}>(Cash of Delivery)</Text>
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.row,
              {marginTop: 20, marginHorizontal: 22, paddingVertical: 10},
            ]}
            activeOpacity={0.8}
            onPress={() => setShowAdressModal(true)}>
            <Image
              source={require('../assets/coffee/location.png')}
              style={{width: 24, height: 24, marginRight: 12}}
            />
            <Text>Add Address</Text>
          </TouchableOpacity>

          <View style={styles.mainContainer}>
            <Text style={styles.heading}>Price Details</Text>
            <View style={styles.totalContainer}>
              <Text style={styles.subHeading}>Item Total</Text>
              <Text style={styles.subHeading2}>
                $ {(noOfCoffee * orderData?.price).toFixed(2)}
              </Text>
            </View>
            <View style={styles.totalContainer}>
              <Text style={styles.subHeading}>Delivery Chargers</Text>
              <Text style={styles.subHeading2}>$ 2.50</Text>
            </View>
            <View style={styles.totalContainer}>
              <Text style={styles.subHeading}>Tax</Text>
              <Text style={styles.subHeading2}>$ 1.20</Text>
            </View>
            <View style={styles.totalPriceContainer}>
              <Text
                style={[
                  styles.subHeading,
                  {
                    color: colors.black,
                  },
                ]}>
                Total Amount
              </Text>
              <Text
                style={[
                  styles.subHeading,
                  {
                    color: colors.coffee_Dark_Brown,
                  },
                ]}>
                $ {(noOfCoffee * orderData?.price + 2.5 + 1.2).toFixed(2)}
              </Text>
            </View>
          </View>
          <View style={styles.btnContainer}>
            <ButtonComponent title="Place Order" style={styles.btn} />
          </View>
        </View>
      </ScreenComponent>
      {showAdressModal && (
        <ShowAddressModal
          showModal={showAdressModal}
          setShowModal={setShowAdressModal}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    marginTop: 30,
    paddingHorizontal: 22,
  },
  totalPriceContainer: {
    marginTop: 30,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: colors.food_gray,
    borderBottomColor: colors.food_gray,
    paddingVertical: 18,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameStyle: {
    fontSize: 16,
    color: colors.black,
    fontFamily: fontFamily.rubik_semi_bold,
    marginBottom: 8,
  },
  subHeading: {
    fontSize: 14,
    color: colors.lightBlack,
    fontFamily: fontFamily.rubik_semi_bold,
  },
  subHeading2: {
    fontSize: 14,
    color: colors.coffee_Dark_Brown,
    fontFamily: fontFamily.rubik_semi_bold,
  },
  heading: {
    fontSize: 16,
    color: colors.food_light_black2,
    fontFamily: fontFamily.rubik_semi_bold,
    marginBottom: 14,
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 14,
  },
  priceStyle: {
    fontSize: 14,
    color: colors.coffee_Dark_Brown,
    fontFamily: fontFamily.rubik_medium,
  },
  img: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  imgContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.food_gray,
    backgroundColor: colors.white,
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: colors.food_gray,
    borderBottomColor: colors.food_gray,
    paddingVertical: 22,
    paddingHorizontal: 22,
  },
  orderNameContainer: {
    paddingTop: 4,
    marginLeft: 18,
    justifyContent: 'space-between',
    paddingBottom: 8,
  },

  myRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: colors.coffee_Dark_Brown,
    width: '80%',
  },
  insideRow: {
    width: 30,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  minusIcon: {
    width: 12,
    height: 12,
    tintColor: colors.white,
  },
  myTxt: {
    fontSize: 14,
    color: colors.white,
    fontFamily: fontFamily.rubik_semi_bold,
  },
  btn: {
    backgroundColor: colors.coffee_Dark_Brown,
    width: '86%',
    alignSelf: 'center',
  },
  btnContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 10,
    height: 50,
  },
});
