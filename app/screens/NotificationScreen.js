import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import ScreenComponent from '../components/ScreenComponent';
import ButtonComponent from '../components/ButtonComponent';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../navigation/navigationStrings';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInLeft,
  FadeInRight,
  FadeInUp,
} from 'react-native-reanimated';
import {getValue, storeValue} from '../helper/storeAndGetAsyncStorageValue';

export default function NotificationScreen() {
  const navigation = useNavigation();

  const handleNavigate = () => {
    navigation.navigate(navigationStrings.MAIN_TAB_ROUTES, {screenNo: 3});
  };

  const handleGetValue = async () => {
    try {
      let key = 'onBoarding';
      let value = await getValue(key);
      console.log('value is ', value);
      console.log('Type of value is ', typeof value);
    } catch (error) {
      console.log(error);
    }
  };

  const handleStoreValue = async () => {
    try {
      let key = 'onBoarding';
      await storeValue(key, 'true');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <ScreenComponent>
        <View style={{flex: 1}}>
          <Animated.Text
            entering={FadeInLeft.delay(200).duration(500)}
            style={styles.text}>
            NotificationScreen
          </Animated.Text>
          <Animated.Text
            entering={FadeInRight.delay(100).duration(1200)}
            style={styles.text}>
            Hello everone
          </Animated.Text>
          <View style={{alignItems: 'center'}}>
            <ButtonComponent
              title="Get Value"
              style={styles.btn}
              onPress={handleGetValue}
            />
            <ButtonComponent
              title="Store Value"
              style={styles.btn1}
              onPress={handleStoreValue}
            />
          </View>
        </View>
      </ScreenComponent>
    </>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    color: colors.purple,
    fontFamily: fontFamily.lato_bold,
    marginVertical: 14,
    alignSelf: 'center',
  },
  btn: {
    width: '50%',
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: colors.gray,
  },
  btn1: {
    width: '50%',
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: colors.primaryGreen,
  },
});
