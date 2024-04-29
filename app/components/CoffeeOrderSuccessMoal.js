import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Image,
} from 'react-native';
import React from 'react';
import ScreenComponent from './ScreenComponent';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const CoffeeOrderSuccessMoal = ({orderSuccess = false, setOrderSuccess}) => {
  return (
    <Modal visible={orderSuccess} transparent animationType="slide">
      <View style={styles.topContainer}>
        <TouchableOpacity
          style={{flex: 1}}
          onPress={() => setOrderSuccess(false)}
        />
        <View style={styles.container}>
          <View style={{flex: 1, alignItems: 'center'}}>
            <View style={styles.checkIconContainer}>
              <Image
                source={require('../assets/check.png')}
                style={styles.checkIconStyle}
              />
            </View>
            <Text style={styles.heading}>Thank You For{'\n'}Your Order</Text>
            <Text style={styles.subHeading}>
              Your order has been successfully placed! It will be delivered to
              you within the next 24 hours.
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: screenHeight / 2,
    backgroundColor: colors.food_gray,
    padding: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  topContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  checkIconContainer: {
    width: 100,
    height: 100,
    backgroundColor: '#027518',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIconStyle: {
    width: 50,
    height: 50,
    tintColor: colors.LightWhite,
  },
  heading: {
    fontSize: 20,
    color: colors.black,
    fontFamily: fontFamily.rubik_medium,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 14,
  },
  subHeading: {
    fontSize: 14,
    color: colors.food_light_black,
    fontFamily: fontFamily.rubik_regular,
    textAlign: 'center',
    width: '90%',
  },
});

export default CoffeeOrderSuccessMoal;
