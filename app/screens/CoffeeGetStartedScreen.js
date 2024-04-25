import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Platform,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import ScreenComponent from '../components/ScreenComponent';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import navigationStrings from '../navigation/navigationStrings';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function CoffeeGetStartedScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  return (
    <>
      <View style={[styles.container]}>
        <ImageBackground
          source={require('../assets/coffee/coffee-bg.jpg')}
          style={styles.imgStyle}>
          <View
            style={[
              styles.bgColor,
              {
                paddingTop: Platform.OS === 'ios' ? insets.top : 14,
                paddingBottom: Platform.OS === 'ios' ? insets.bottom : 30,
              },
            ]}>
            <View style={styles.contentContainer}>
              <Text style={styles.heading}>
                Good coffee,{'\n'}Good friends,{'\n'}let id brends
              </Text>
              <Text style={styles.subHeading}>
                The best grain, the finest roast, the powerful flavor.
              </Text>
              <TouchableOpacity
                style={styles.btn}
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate(navigationStrings.Coffee_Home_Screen)
                }>
                <Text style={styles.btnTxt}>Get Started</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightBlack,
  },
  imgStyle: {
    flex: 1,
    width: null,
    height: null,
  },
  bgColor: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  heading: {
    fontSize: 24,
    color: colors.LightWhite,
    fontFamily: fontFamily.rubik_medium,
    lineHeight: 26,
  },
  contentContainer: {
    marginBottom: '10%',
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  subHeading: {
    fontSize: 12,
    color: colors.coffee_Light_White,
    fontFamily: fontFamily.rubik_medium,
    textAlign: 'center',
    width: '50%',
    marginTop: 12,
    marginBottom: 30,
  },
  btn: {
    backgroundColor: colors.coffee_primary,
    width: '70%',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 22,
  },
  btnTxt: {
    fontSize: 16,
    color: colors.white,
    fontFamily: fontFamily.lato_bold,
  },
});
