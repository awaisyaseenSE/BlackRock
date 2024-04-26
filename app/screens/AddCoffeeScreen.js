import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import {pickImage} from '../helper/mediaPicker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import ScreenComponent from '../components/ScreenComponent';
import TopCompoWithHeading from '../components/TopCompoWithHeading';
import TextInputCompo from '../components/TextInputCompo';
import {getResponsiveHeight} from '../utils/getResponsiveMarginPadding';
import ButtonComponent from '../components/ButtonComponent';

export default function AddCoffeeScreen() {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [coffeeName, setcoffeeName] = useState('');
  const [coffeeNameError, setcoffeeNameError] = useState('');
  const [coffeeDesc, setCoffeeDesc] = useState('');
  const [coffeePirce, setCoffeePrice] = useState('');
  const [coffeePirceError, setCoffeePriceError] = useState('');
  const [coffeeVolume, setCoffeeVolume] = useState('');
  const [coffeeVolumeError, setCoffeeVolumeError] = useState('');
  const [coffeeRating, setCoffeeRating] = useState('');
  const [coffeeRatingError, setCoffeeRatingError] = useState('');
  const [selectedImg, setSelectedImg] = useState('');
  const [selectedImgError, setSelectedImgError] = useState('');

  const handleAddCoffeeToFirestore = async imgUrl => {
    try {
      setLoading(true);
      firestore()
        .collection('coffee')
        .add({
          image: imgUrl,
          time: new Date(),
          userUid: auth().currentUser.uid,
          name: coffeeName,
          price: coffeePirce,
          volume: coffeeVolume,
          stars: coffeeRating,
          desc: coffeeDesc,
        })
        .then(() => {
          setLoading(false);
          Alert.alert('Added!', `Coffee ${coffeeName} is added successfully.`);
        })
        .catch(er => {
          setLoading(false);
          console.log(
            'getting error while uploading coffee data to firestore: ',
            er,
          );
        });
    } catch (error) {
      setLoading(false);
      console.log('Error while storing add coffee data in firestore: ', error);
    }
  };

  const uploadImage = async uri => {
    let id = Date.now();
    const imageName = `coffeeImages/Coffee_${id}.jpg`;
    const reference = storage().ref(imageName);

    try {
      setLoading(true);
      const response = await fetch(uri);
      const blobImage = await response.blob();
      const task = reference.put(blobImage);
      await task;
      const downloadURL = await reference.getDownloadURL();
      setLoading(false);
      return downloadURL;
    } catch (error) {
      if (error.code == 'storage/unknown') {
        setLoading(false);
        console.log('error while uploading coffee picture: ', error);
        return null;
      }
      console.log('Error uploading coffee image: ', error?.message);
      setLoading(false);
      return null;
    }
  };

  const handleAddCoffee = async () => {
    if (selectedImg === '') {
      setSelectedImgError('Error');
    } else {
      setSelectedImgError('');
    }
    if (coffeeName === '') {
      setcoffeeNameError('Error');
    } else {
      setcoffeeNameError('');
    }
    if (coffeePirce === '') {
      setCoffeePriceError('Error');
    } else {
      setCoffeePriceError('');
    }
    if (coffeeVolume === '') {
      setCoffeeVolumeError('Error');
    } else {
      setCoffeeVolumeError('');
    }
    if (coffeeRating === '') {
      setCoffeeRatingError('Error');
    } else {
      setCoffeeRatingError('');
    }

    if (
      selectedImg !== '' &&
      coffeeName.length > 0 &&
      coffeePirce.length > 0 &&
      coffeeVolume.length > 0 &&
      coffeeRating.length > 0
    ) {
      let downloadURLRes = await uploadImage(selectedImg);
      if (downloadURLRes) {
        handleAddCoffeeToFirestore(downloadURLRes);
      } else {
        Alert.alert('Something went wrong!', 'Please try again later.');
      }
    }
  };

  const handleSelectImage = async () => {
    try {
      let res = await pickImage('photo');
      if (!!res) {
        setSelectedImg(res?.uri);
        setSelectedImgError('');
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  return (
    <>
      <ScreenComponent
        style={{backgroundColor: colors.coffee_Light_White}}
        content={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
        backgroundColor={colors.coffee_Dark_Brown}>
        <TouchableWithoutFeedback style={{flex: 1}} onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            style={{
              flex: 1,
              width: '100%',
            }}
            behavior={Platform.OS === 'ios' ? 'padding' : null}
            enabled
            keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}>
            <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
              <View style={styles.container}>
                <TopCompoWithHeading
                  title="Add Coffee"
                  titleStyle={{color: colors.black}}
                  backIconStyle={{tintColor: colors.black}}
                  onPress={() => navigation.goBack()}
                />
                <View style={styles.mainContainer}>
                  <TouchableOpacity
                    style={[
                      styles.addImgContainer,
                      {
                        borderColor:
                          selectedImgError !== ''
                            ? colors.red
                            : colors.food_gray,
                      },
                    ]}
                    activeOpacity={0.6}
                    onPress={handleSelectImage}
                    onLongPress={() => {
                      if (selectedImg !== '') {
                        setSelectedImg('');
                      }
                    }}>
                    {selectedImg !== '' ? (
                      <Image
                        source={{uri: selectedImg}}
                        style={styles.userSelectedImg}
                      />
                    ) : (
                      <View style={{alignItems: 'center'}}>
                        <Image
                          source={require('../assets/food/picture.png')}
                          style={styles.picStyle}
                        />
                        <Text style={styles.addIMgTxt}>Add image here</Text>
                        <Text style={styles.addIMgSubTxt}>
                          You can remove an image by{'\n'}long pressing on it.
                        </Text>
                      </View>
                    )}
                    {selectedImgError !== '' && (
                      <Image
                        source={require('../assets/coffee/error.png')}
                        style={styles.errorIcon}
                      />
                    )}
                  </TouchableOpacity>
                  <View style={styles.row2}>
                    <Text style={styles.titleTxt}>Coffee Name</Text>
                    {coffeeNameError !== '' && (
                      <Image
                        style={styles.errorIcon2}
                        source={require('../assets/coffee/error.png')}
                      />
                    )}
                  </View>
                  <TextInputCompo
                    value={coffeeName}
                    onChangeText={text => {
                      if (text.trim().length) {
                        setcoffeeName(text);
                        setcoffeeNameError('');
                      } else {
                        setcoffeeName('');
                      }
                    }}
                    inputStyle={{
                      borderColor:
                        coffeeNameError !== ''
                          ? colors.red
                          : colors.borderColor,
                    }}
                    maxLength={40}
                    textStyle={styles.txtStyle}
                    clearIcon={coffeeName.length > 0 ? 'Clear' : ''}
                    onPressClear={() => setcoffeeName('')}
                    placeholder={''}
                  />
                  <Text
                    style={[
                      styles.titleTxt,
                      {
                        marginBottom: 6,
                        marginTop: 12,
                      },
                    ]}>
                    Description
                  </Text>
                  <TextInputCompo
                    value={coffeeDesc}
                    onChangeText={text => {
                      if (text.trim().length) {
                        setCoffeeDesc(text);
                      } else {
                        setCoffeeDesc('');
                      }
                    }}
                    inputStyle={styles.inputStyle}
                    textStyle={styles.txtStyle2}
                    placeholder={''}
                    multiline
                  />
                  <View style={styles.row2}>
                    <Text style={styles.titleTxt}>Price</Text>
                    {coffeePirceError !== '' && (
                      <Image
                        style={styles.errorIcon2}
                        source={require('../assets/coffee/error.png')}
                      />
                    )}
                  </View>
                  <TextInputCompo
                    value={coffeePirce}
                    onChangeText={text => {
                      if (text.trim().length) {
                        setCoffeePrice(text);
                        setCoffeePriceError('');
                      } else {
                        setCoffeePrice('');
                      }
                    }}
                    inputStyle={{
                      borderColor:
                        coffeePirceError !== ''
                          ? colors.red
                          : colors.borderColor,
                    }}
                    maxLength={5}
                    textStyle={styles.txtStyle}
                    placeholder={''}
                    keyboardType="decimal-pad"
                  />

                  <View style={styles.row2}>
                    <Text style={styles.titleTxt}>Volume (enter in ml)</Text>
                    {coffeeVolumeError !== '' && (
                      <Image
                        style={styles.errorIcon2}
                        source={require('../assets/coffee/error.png')}
                      />
                    )}
                  </View>
                  <TextInputCompo
                    value={coffeeVolume}
                    onChangeText={text => {
                      if (text.trim().length) {
                        setCoffeeVolume(text);
                        setCoffeeVolumeError('');
                      } else {
                        setCoffeeVolume('');
                      }
                    }}
                    inputStyle={{
                      borderColor:
                        coffeeVolumeError !== ''
                          ? colors.red
                          : colors.borderColor,
                    }}
                    maxLength={4}
                    textStyle={styles.txtStyle}
                    placeholder={''}
                    keyboardType="number-pad"
                  />
                  <View style={styles.row}>
                    <Image
                      source={require('../assets/coffee/star.png')}
                      style={styles.starIcon}
                    />
                    <Text
                      style={[
                        styles.titleTxt,
                        {
                          marginTop: 0,
                          marginBottom: 0,
                        },
                      ]}>
                      Add Rating
                    </Text>
                    {coffeeRatingError !== '' && (
                      <Image
                        style={styles.errorIcon2}
                        source={require('../assets/coffee/error.png')}
                      />
                    )}
                  </View>
                  <TextInputCompo
                    value={coffeeRating}
                    onChangeText={text => {
                      if (text.trim().length) {
                        setCoffeeRating(text);
                        setCoffeeRatingError('');
                      } else {
                        setCoffeeRating('');
                      }
                    }}
                    inputStyle={{
                      borderColor:
                        coffeeRatingError !== ''
                          ? colors.red
                          : colors.borderColor,
                    }}
                    maxLength={3}
                    textStyle={styles.txtStyle}
                    placeholder={''}
                    keyboardType="decimal-pad"
                  />
                  <ButtonComponent
                    title="Add Coffee"
                    style={styles.btn}
                    loading={loading}
                    onPress={handleAddCoffee}
                  />
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </ScreenComponent>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 20,
  },
  btn: {
    backgroundColor: colors.coffee_Light_Brown,
    width: '80%',
    alignSelf: 'center',
    marginTop: 12,
  },
  mainContainer: {
    paddingHorizontal: 20,
  },
  picStyle: {
    width: 100,
    height: 100,
  },
  addImgContainer: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.food_gray,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 26,
    marginBottom: 20,
  },
  addIMgTxt: {
    fontSize: 16,
    color: colors.black,
    fontFamily: fontFamily.rubik_medium,
    marginTop: 12,
    marginBottom: 6,
  },
  addIMgSubTxt: {
    fontSize: 12,
    color: colors.gray,
    fontFamily: fontFamily.rubik_medium,
    textAlign: 'center',
    width: '60%',
  },
  titleTxt: {
    fontSize: 14,
    color: colors.gray,
    fontFamily: fontFamily.rubik_semi_bold,
  },
  inputStyle: {
    height: getResponsiveHeight(16),
  },
  txtStyle: {
    fontSize: 14,
    color: colors.food_light_black2,
    height: '100%',
  },
  txtStyle2: {
    fontSize: 14,
    color: colors.food_light_black2,
    flex: 1,
    height: '100%',
    marginTop: 14,
  },
  starIcon: {
    width: 24,
    height: 24,
    tintColor: colors.food_Light_yellow,
    marginRight: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  userSelectedImg: {
    width: 150,
    height: 150,
    borderRadius: 12,
  },
  errorIcon: {
    width: 20,
    height: 20,
    position: 'absolute',
    top: 10,
    right: 10,
  },
  errorIcon2: {
    width: 18,
    height: 18,
    marginLeft: 6,
  },
  row2: {
    marginTop: 12,
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
