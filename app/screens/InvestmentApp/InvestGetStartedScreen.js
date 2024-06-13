import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import ScreenComponent from '../../components/ScreenComponent';
import colors from '../../styles/colors';
import fontFamily from '../../styles/fontFamily';
import ButtonComponent from '../../components/ButtonComponent';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../../navigation/navigationStrings';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function InvestGetStartedScreen() {
  const navigation = useNavigation();
  return (
    <ScreenComponent
      style={{backgroundColor: colors.invest_white}}
      content={Platform.OS === 'android' ? 'light-content' : 'dark-content'}>
      <View style={styles.container}>
        <View style={styles.imgContainer}>
          <Image
            source={require('../../assets/invest/get-started.png')}
            style={styles.img}
          />
        </View>
        <View style={styles.mainContainer}>
          <Text style={styles.heading}>
            Stay on top of your finance with us.
          </Text>
          <Text style={styles.subHeading}>
            We are your new financial Advisors to recommed the best investments
            for you.
          </Text>
          <View style={{flex: 1, width: '80%', justifyContent: 'center'}}>
            <ButtonComponent
              title="Get Started"
              style={styles.btn}
              onPress={() =>
                navigation.navigate(navigationStrings.InvestBottomTab)
              }
            />
            <TouchableOpacity style={styles.loginBtnContainer}>
              <Text style={styles.loginTxt}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScreenComponent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  img: {
    width: screenWidth / 1.8,
    height: 220,
  },
  imgContainer: {
    flex: 0.4,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  mainContainer: {
    flex: 0.6,
    alignItems: 'center',
    marginTop: 30,
  },
  heading: {
    fontSize: 28,
    color: colors.black,
    fontFamily: fontFamily.rubik_bold,
    textAlign: 'center',
    width: '74%',
    marginBottom: 20,
  },
  subHeading: {
    fontSize: 18,
    color: colors.lightBlack,
    fontFamily: fontFamily.rubik_medium,
    textAlign: 'center',
    width: '80%',
  },
  btn: {
    backgroundColor: colors.invest_green,
    width: '100%',
    height: 50,
    borderRadius: 16,
  },
  loginBtnContainer: {
    alignSelf: 'center',
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  loginTxt: {
    color: colors.invest_green,
    fontFamily: fontFamily.lato_bold,
    fontSize: 16,
  },
});
