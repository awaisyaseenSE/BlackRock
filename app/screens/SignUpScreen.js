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
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../navigation/navigationStrings';
import {pickImage} from '../helper/mediaPicker';
import {validateEmail} from '../helper/validation';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import useAuths from '../auth/useAuth';

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState('');
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [imageError, setImageError] = useState('');
  const [loading, setLoading] = useState(false);
  const {user, setUser} = useAuths();

  const handlePickImage = async () => {
    try {
      let res = await pickImage();
      if (!!res) {
        setSelectedImage(res);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const uploadImage = async uri => {
    const imageName = `profileImages/${auth()?.currentUser?.uid}.jpg`;
    const reference = storage().ref(imageName);

    try {
      const response = await fetch(uri);
      const blobImage = await response.blob();
      const task = reference.put(blobImage);
      await task;
      const downloadURL = await reference.getDownloadURL();
      return downloadURL;
    } catch (error) {
      if (error.code == 'storage/unknown') {
        setLoading(false);
        console.log('error while uploading profile picture: ', error);
        return null;
      }
      console.error('Error uploading image: ', error.message);
      setLoading(false);
      return null;
    }
  };

  const handleUploadUserData = async () => {
    try {
      let downloadURLOfImage = await uploadImage(selectedImage);
      if (!!downloadURLOfImage) {
        await auth().currentUser?.updateProfile({
          displayName: name,
          photoURL: downloadURLOfImage,
        });
        await firestore().collection('users').doc(auth().currentUser.uid).set({
          fullName: name,
          email: email,
          imageUrl: downloadURLOfImage,
          dateOfJoin: new Date(),
        });
        setLoading(false);
        setUser(auth().currentUser);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log('Error while uploading data of user to firestore: ', error);
    }
  };

  const handleSignUp = () => {
    if (selectedImage === '') {
      setImageError('Image is required!');
    } else {
      setImageError('');
    }
    if (name === '') {
      setNameError('Name is required!');
    } else {
      setNameError('');
    }
    if (password === '') {
      setPasswordError('Password is required!');
    } else {
      if (password.length < 6) {
        setPasswordError('Password is not less then 6 characters!');
      } else {
        setPasswordError('');
      }
    }

    if (email === '') {
      setEmailError('Email is required!');
    } else {
      if (!validateEmail(email)) {
        setEmailError('Email is invalid!');
      } else {
        setEmailError('');
      }
    }

    try {
      if (
        selectedImage !== '' &&
        name !== '' &&
        validateEmail(email) &&
        password.length > 5
      ) {
        setLoading(true);
        auth()
          .createUserWithEmailAndPassword(email, password)
          .then(result => {
            handleUploadUserData();
            console.log('User account created & signed in!');
          })
          .catch(error => {
            if (error.code === 'auth/email-already-in-use') {
              setLoading(false);
              console.log('That email address is already in use!');
              setEmailError('That email address is already in use!');
            }
            if (error.code === 'auth/invalid-email') {
              setLoading(false);
              console.log('That email address is invalid!');
              setEmailError('That email address is invalid!');
            }
            if (error.code == 'auth/weak-password') {
              setLoading(false);
              console.log(
                'Password is weak, password must be 6 characters or more!',
              );
              setEmailError('Password is weak, try again!');
            }
            setLoading(false);
            console.log('getting ERROR while Sign up with Eamil: ', error);
          });
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
    }
  };

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
              <View
                style={{
                  marginBottom: getResponsiveMargin(20),
                }}>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity onPress={handlePickImage}>
                    <Image
                      source={
                        selectedImage !== ''
                          ? {uri: selectedImage}
                          : require('../assets/avatar.png')
                      }
                      style={styles.profileImage}
                    />
                    <View style={styles.cameraIconContainer}>
                      <Image
                        source={require('../assets/camera.png')}
                        style={styles.cameraIcon}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
                {imageError !== '' && (
                  <Text style={[styles.errorText, {marginTop: 4}]}>
                    {imageError}
                  </Text>
                )}
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
                      <View style={styles.labelTxtContainer}>
                        <Text style={styles.labelText}>Name</Text>
                        {nameError !== '' && (
                          <Text style={styles.errorText}>{nameError}</Text>
                        )}
                      </View>

                      <TextInputCompo
                        placeholder="FullName"
                        onChangeText={text => setName(text)}
                        value={name}
                        clearIcon={name.length > 0 ? 'Clear' : ''}
                        onPressClear={() => setName('')}
                        inputStyle={{
                          marginBottom: getResponsiveMargin(20),
                          borderColor:
                            nameError !== '' ? colors.red : colors.borderColor,
                        }}
                      />

                      <View style={styles.labelTxtContainer}>
                        <Text style={styles.labelText}>Email</Text>
                        {emailError !== '' && (
                          <Text style={styles.errorText}>{emailError}</Text>
                        )}
                      </View>
                      <TextInputCompo
                        placeholder="hello@example.com"
                        onChangeText={text => setEmail(text)}
                        value={email}
                        clearIcon={email.length > 0 ? 'Clear' : ''}
                        onPressClear={() => setEmail('')}
                        keyboardType="email-address"
                        inputStyle={{
                          marginBottom: getResponsiveMargin(20),
                          borderColor:
                            emailError !== '' ? colors.red : colors.borderColor,
                        }}
                        autoCapitalize="none"
                      />
                      <View style={styles.labelTxtContainer}>
                        <Text style={styles.labelText}>Password</Text>
                        {passwordError !== '' && (
                          <Text style={styles.errorText}>{passwordError}</Text>
                        )}
                      </View>
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
                        inputStyle={{
                          borderColor:
                            passwordError !== ''
                              ? colors.red
                              : colors.borderColor,
                        }}
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
                    <ButtonComponent
                      title="Sign up"
                      onPress={handleSignUp}
                      loading={loading}
                    />
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
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate(navigationStrings.LOGIN_SCREEN)
                    }>
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
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  cameraIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    tintColor: colors.lightBlack,
  },
  cameraIconContainer: {
    width: 26,
    height: 26,
    backgroundColor: colors.skyBlue,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    position: 'absolute',
    bottom: 4,
    right: 0,
  },
  errorText: {
    fontSize: 14,
    fontFamily: fontFamily.rubik_regular,
    color: colors.red,
    paddingLeft: 4,
  },
  labelTxtContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
