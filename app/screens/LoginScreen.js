import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React, {useState} from 'react';
import colors from '../styles/colors';
import ScreenComponent from '../components/ScreenComponent';
import fontFamily from '../styles/fontFamily';
import {
  getFontSize,
  getResponsiveMargin,
} from '../utils/getResponsiveMarginPadding';
import TextInputCompo from '../components/TextInputCompo';
import ButtonComponent from '../components/ButtonComponent';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [isSignIn, setIsSignIn] = useState(false);
  const [isPhoneSelected, setIsPhoneSelected] = useState(false);
  return (
    <>
      <ScreenComponent style={{backgroundColor: colors.white}}>
        <TouchableWithoutFeedback style={{flex: 1}} onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <Text style={styles.heading}>Login</Text>
            <Text style={styles.subHeading}>Welcome back to the app</Text>
            <View style={styles.emailPhoneTxtContainer}>
              <TouchableOpacity
                onPress={() => setIsPhoneSelected(false)}
                style={[
                  styles.emailContainer,
                  {
                    borderBottomWidth: !isPhoneSelected ? 1 : 0,
                    borderBottomColor: !isPhoneSelected ? colors.darkBlue : '',
                  },
                ]}>
                <Text
                  style={[
                    styles.emailText,
                    {
                      color: isPhoneSelected ? colors.gray : colors.darkBlue,
                    },
                  ]}>
                  Email
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsPhoneSelected(true)}
                style={{
                  paddingVertical: 6,
                  borderBottomWidth: isPhoneSelected ? 1 : 0,
                  borderBottomColor: isPhoneSelected ? colors.darkBlue : '',
                }}>
                <Text
                  style={[
                    styles.emailText,
                    {
                      color: !isPhoneSelected ? colors.gray : colors.darkBlue,
                    },
                  ]}>
                  Phone Number
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputFieldsContainer}>
              <Text
                style={[
                  styles.heading2,
                  {marginBottom: getResponsiveMargin(8)},
                ]}>
                {isPhoneSelected ? 'Phone number' : 'Email Address'}
              </Text>
              {isPhoneSelected ? (
                <TextInputCompo
                  placeholder="Phone number"
                  onChangeText={text => setPhone(text)}
                  value={phone}
                  clearIcon={phone.length > 0 ? 'Clear' : ''}
                  onPressClear={() => setPhone('')}
                  keyboardType="phone-pad"
                />
              ) : (
                <TextInputCompo
                  placeholder="hello@example.com"
                  onChangeText={text => setEmail(text)}
                  value={email}
                  clearIcon={email.length > 0 ? 'Clear' : ''}
                  onPressClear={() => setEmail('')}
                  keyboardType="email-address"
                />
              )}
              <View style={styles.passwordTextContainer}>
                <Text style={styles.heading2}>Password</Text>
                <TouchableOpacity>
                  <Text style={styles.forgotTxt}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
              <TextInputCompo
                placeholder={'Enter Password'}
                value={password}
                onChangeText={text => setPassword(text)}
                secureTextEntry={secureTextEntry}
                onPressSecure={() => setSecureTextEntry(!secureTextEntry)}
                secureText={
                  secureTextEntry
                    ? require('../assets/view.png')
                    : require('../assets/hide.png')
                }
              />
            </View>
            <View style={styles.keepMeSignINContainer}>
              <TouchableOpacity
                onPress={() => setIsSignIn(!isSignIn)}
                style={isSignIn ? styles.fillBox : styles.emptyBox}>
                {isSignIn && (
                  <Image
                    source={require('../assets/check.png')}
                    style={styles.checkIcon}
                  />
                )}
              </TouchableOpacity>
              <Text style={[styles.subHeading, {marginTop: 0, marginLeft: 14}]}>
                Keep me signed in
              </Text>
            </View>
            <ButtonComponent
              title="Login"
              style={{marginTop: getResponsiveMargin(18)}}
            />
            <View style={styles.signINWithContainer}>
              <View style={styles.lineStyle} />
              <Text
                style={[
                  styles.subHeading,
                  {marginTop: 0, marginHorizontal: 10},
                ]}>
                or sign in with
              </Text>
              <View style={styles.lineStyle} />
            </View>
            <View>
              <TouchableOpacity style={styles.googleBtn} activeOpacity={0.6}>
                <View style={styles.googleBtnContentContainer}>
                  <Image
                    source={require('../assets/google.png')}
                    style={styles.googleIcon}
                  />
                  <Text style={styles.googleTxt}>Continue with Google</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.footer}>
              <TouchableOpacity style={{padding: 10}}>
                <Text style={styles.createAccoutTxt}>Create an account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScreenComponent>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    marginTop: '6%',
  },
  heading: {
    fontSize: getFontSize(22),
    fontFamily: fontFamily.rubik_bold,
    color: colors.black,
  },
  subHeading: {
    fontSize: getFontSize(14),
    fontFamily: fontFamily.rubik_medium,
    color: colors.gray,
    marginTop: 6,
  },
  emailPhoneTxtContainer: {
    marginTop: getResponsiveMargin(20),
    flexDirection: 'row',
    alignItems: 'center',
  },
  emailText: {
    fontSize: getFontSize(16),
    color: colors.gray,
    fontFamily: fontFamily.rubik_medium,
  },
  emailContainer: {
    paddingVertical: 6,
    marginRight: getResponsiveMargin(20),
  },
  inputFieldsContainer: {
    marginTop: getResponsiveMargin(16),
  },
  heading2: {
    fontSize: getFontSize(16),
    color: colors.lightBlack,
    fontFamily: fontFamily.rubik_medium,
  },
  forgotTxt: {
    fontSize: 12,
    fontFamily: fontFamily.rubik_regular,
    color: colors.darkBlue,
  },
  passwordTextContainer: {
    marginBottom: getResponsiveMargin(8),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emptyBox: {
    width: 18,
    height: 18,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: colors.borderColor,
  },
  fillBox: {
    width: 18,
    height: 18,
    borderRadius: 2,
    backgroundColor: colors.darkBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keepMeSignINContainer: {
    marginTop: getResponsiveMargin(8),
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIcon: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
    tintColor: colors.white,
  },
  signINWithContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: getResponsiveMargin(26),
  },
  lineStyle: {
    flex: 1,
    height: 1,
    borderRadius: 2,
    backgroundColor: colors.borderColor,
  },
  googleIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  googleBtn: {
    alignItems: 'center',
    height: 46,
    justifyContent: 'center',
    backgroundColor: colors.borderColor,
    borderRadius: 22,
  },
  googleBtnContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  googleTxt: {
    fontSize: 14,
    fontFamily: fontFamily.rubik_medium,
    color: colors.lightBlack,
    marginLeft: 12,
  },
  createAccoutTxt: {
    fontSize: 14,
    fontFamily: fontFamily.rubik_semi_bold,
    color: colors.darkBlue,
  },
  footer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: getResponsiveMargin(24),
  },
});
