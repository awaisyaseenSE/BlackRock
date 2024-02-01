import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
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
import LinearGradient from 'react-native-linear-gradient';

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  return (
    <>
      <LinearGradient
        start={{x: 1, y: 0}}
        end={{x: 0, y: 1}}
        colors={['#F5F5F5', '#F9F9F9', '#E3F7FF']}
        style={{flex: 1}}>
        <ScreenComponent style={{}}>
          <TouchableWithoutFeedback
            style={{flex: 1}}
            onPress={Keyboard.dismiss}>
            <View style={styles.container}>
              <View style={styles.headingContainer}>
                {/* <Text style={styles.heading}>Create an account</Text> */}
                <Text style={styles.heading}>Create an account</Text>
              </View>
              <KeyboardAvoidingView
                style={{
                  flex: 1,
                  width: '100%',
                }}
                behavior={Platform.OS === 'ios' ? 'padding' : null}
                enabled
                keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}>
                <ScrollView
                  style={{flex: 1}}
                  showsVerticalScrollIndicator={false}>
                  <View style={{flex: 1}}>
                    <View
                      style={{
                        marginBottom: getResponsiveMargin(18),
                      }}>
                      <Text style={styles.labelText}>Name</Text>
                      <TextInputCompo
                        placeholder="FullName"
                        onChangeText={text => setName(text)}
                        value={name}
                        clearIcon={name.length > 0 ? 'Clear' : ''}
                        onPressClear={() => setName('')}
                        inputStyle={{marginBottom: getResponsiveMargin(20)}}
                      />
                      <Text style={styles.labelText}>Email</Text>
                      <TextInputCompo
                        placeholder="hello@example.com"
                        onChangeText={text => setEmail(text)}
                        value={email}
                        clearIcon={email.length > 0 ? 'Clear' : ''}
                        onPressClear={() => setEmail('')}
                        keyboardType="email-address"
                        inputStyle={{marginBottom: getResponsiveMargin(20)}}
                      />
                      <Text style={styles.labelText}>Password</Text>
                      <TextInputCompo
                        placeholder={'Enter Password'}
                        value={password}
                        onChangeText={text => setPassword(text)}
                        secureTextEntry={secureTextEntry}
                        onPressSecure={() =>
                          setSecureTextEntry(!secureTextEntry)
                        }
                        secureText={
                          secureTextEntry
                            ? require('../assets/view.png')
                            : require('../assets/hide.png')
                        }
                      />
                    </View>
                    <View style={{marginBottom: getResponsiveMargin(16)}}>
                      <Text style={styles.subHeading}>
                        By continuing, you agree to our{' '}
                        <Text
                          style={[styles.subHeading, {color: colors.darkBlue}]}>
                          terms of service.
                        </Text>
                      </Text>
                    </View>
                    <ButtonComponent title="Sign up" />
                    <View style={styles.orContainer}>
                      <View style={styles.lineStyle} />
                      <Text style={styles.orTxt}>or</Text>
                      <View style={styles.lineStyle} />
                    </View>
                    <TouchableOpacity
                      style={styles.googleBtn}
                      activeOpacity={0.6}>
                      <View style={styles.googleBtnContentContainer}>
                        <Image
                          source={require('../assets/google.png')}
                          style={styles.googleIcon}
                        />
                        <Text style={styles.googleTxt}>
                          Continue with Google
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </KeyboardAvoidingView>
              <View style={styles.footer}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.subHeading}>
                    Already have an account?
                  </Text>
                  <TouchableOpacity>
                    <Text
                      style={[
                        styles.subHeading,
                        {
                          color: colors.darkBlue,
                          fontFamily: fontFamily.rubik_semi_bold,
                        },
                      ]}>
                      {' '}
                      Sign in here
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScreenComponent>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: getFontSize(26),
    color: colors.black,
    fontFamily: fontFamily.rubik_bold,
    textAlign: 'left',
  },
  headingContainer: {
    marginTop: getResponsiveMargin(34),
    marginBottom: getResponsiveMargin(22),
  },
  labelText: {
    fontSize: 14,
    color: colors.black,
    fontFamily: fontFamily.rubik_medium,
    marginBottom: 8,
    paddingLeft: 2,
  },
  subHeading: {
    fontSize: getFontSize(14),
    color: colors.gray,
    fontFamily: fontFamily.rubik_regular,
  },
  orContainer: {
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
  orTxt: {
    fontSize: getFontSize(14),
    color: colors.gray,
    fontFamily: fontFamily.rubik_regular,
    marginHorizontal: getResponsiveMargin(16),
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
  footer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: getResponsiveMargin(24),
  },
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.skyBlue,
  },
});
