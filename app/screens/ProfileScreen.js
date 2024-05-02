import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  Modal,
  Pressable,
  Linking,
  Animated,
  Easing,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {
  getResponsiveHeight,
  getResponsiveWidth,
} from '../utils/getResponsiveMarginPadding';
import {pickImage} from '../helper/mediaPicker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import {removeItemValue} from '../helper/storeAndGetAsyncStorageValue';
import navigationStrings from '../navigation/navigationStrings';
import constants from '../constants/constants';
import MyIndicatorLoader from '../components/MyIndicatorLoader';
import {CachedImage} from '../utils/CachedImage';
import ButtonComponent from '../components/ButtonComponent';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [selectedImage, setSelectedImage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [medialUrls, setMediaUrls] = useState([]);
  const navigation = useNavigation();
  const userImage = auth()?.currentUser?.photoURL;
  const [showImageModal, setShowImageModal] = useState(false);

  const handleAddselectImages = newImage => {
    setSelectedImage(prevImages => [...prevImages, newImage]);
  };

  const handleCancelImage = index => {
    setSelectedImage(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const handleSelectImages = async () => {
    try {
      let res = await pickImage();
      if (!!res) {
        handleAddselectImages(res);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const storeImagesToFirestore = async urls => {
    let img = urls.length > 1 ? 'images' : 'image';

    try {
      setLoading(true);
      firestore()
        .collection('testingImages')
        .add({
          imagesUrls: urls,
          time: new Date(),
          userUid: auth().currentUser.uid,
          type: 'test',
        })
        .then(docRef => {
          setLoading(false);
          Alert.alert(`${img} is uploaded successfully!`);
        })
        .catch(er => {
          setLoading(false);

          console.log('getting error while uploading post to firestore: ', er);
        });
    } catch (error) {
      setLoading(false);

      console.log('Error in storing images to firestore: ', error);
    }
  };

  const uploadImages = async newImages => {
    setLoading(true);
    try {
      let allUrls = [];
      await Promise.all(
        newImages.map(async image => {
          const response = await fetch(image);
          const blobImage = await response.blob();
          const timestamp = Date.now();
          const postId = `test_${timestamp}`;
          const imageRef = storage().ref().child(`testImages/${postId}.jpg`);
          await imageRef.put(blobImage); // Use put() instead of putFile()
          const downloadURL = await imageRef.getDownloadURL();
          allUrls.push(downloadURL);
          setMediaUrls(prevData => [...prevData, downloadURL]);
        }),
      );
      setLoading(false);
      storeImagesToFirestore(allUrls);
    } catch (error) {
      console.error('Error uploading images: ', error);
      setLoading(false);
    }
  };

  const renderItem = ({item, index}) => {
    return (
      <View style={{marginRight: 8}}>
        <Image source={{uri: item}} style={styles.selectedimage} />
        <TouchableOpacity
          style={styles.closeIconContainer}
          onPress={() => handleCancelImage(index)}>
          <Image
            source={require('../assets/close.png')}
            style={styles.closeIcon}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const handleFinishOnBoarding = async () => {
    try {
      console.log('Finish on boarding func is called!');
      let key = 'onBoarding';
      let res = await removeItemValue(key);
      if (res) {
        Alert.alert('Onboarding is Removed Successfully!');
      } else {
        Alert.alert(
          'Something went wrong.',
          'Onboarding screens is not Removed!',
        );
      }
    } catch (error) {
      console.log('Error in finish on boarding screen function: ', error);
    }
  };

  const [color, setColor] = useState('#072e70');
  const generateColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0');
    setColor(`#${randomColor}`);
    // return `#${randomColor}`;
  };

  const openDialScreen = () => {
    let number = '';
    if (Platform.OS === 'ios') {
      number = 'tel:${091123456789}';
    } else {
      number = 'tel:${03085449343}';
    }
    Linking.openURL(number);
  };

  const getTrandingMovies = async () => {
    let url = 'https://api.themoviedb.org/3/trending/movie/week';
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.themoviedb.org/3/trending/tv/week?api_key=${constants.theMovieDb_API_KEY}`,
      );

      if (!response.ok) {
        setLoading(false);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      let res = await response.json();
      if (!!res) {
        setLoading(false);
        console.log(res);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getDetailByTv = async id => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${id}/recommendations?api_key=${constants.theMovieDb_API_KEY}`,
      );

      if (!response.ok) {
        setLoading(false);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      let res = await response.json();
      if (!!res) {
        setLoading(false);
        console.log('TV data.......  :   ', res);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const [spinAnim, setSpinAnim] = useState(new Animated.Value(0));
  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  });

  const handleQuery = async () => {
    try {
      let today = new Date();
      today.setHours(0, 0, 0, 0);
      let temArr = [];
      let ref = firestore().collection('testFirestore');
      const query = await ref
        .where('age', '==', 12)
        // .where('time', '<=', today)
        // .where('time', '<', new Date(today.getTime() + 86400000))
        .get();
      if (query.size > 0) {
        query.docs.forEach(doc => {
          let data = {id: doc.id, ...doc.data()};
          temArr.push(data);
        });
        if (temArr.length > 0) {
          console.log(
            'Total users is: ',
            temArr.length,
            ' and Final data of user is: ',
            temArr,
          );
        }
      } else {
        console.log('data not found!');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getCityWeatherData = async cityName => {
    try {
      let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${constants.open_Weather_API_KEY}`;
      let response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMovieDetails = async () => {
    const url =
      'https://ott-details.p.rapidapi.com/advancedsearch?warstart_year=1970&end_year=2024&min_imdb=5&type=movie&sort=latest&page=1';
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '5f75410f4emshf143142155a6dd7p101489jsn46223137d60a',
        'X-RapidAPI-Host': 'ott-details.p.rapidapi.com',
      },
    };

    try {
      setLoading(true);
      const response = await fetch(url, options);
      const result = await response.json();
      if (!!result) {
        console.log('data results is: ', result?.results?.length);
        console.log(result);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const foodRecipeApp = async () => {
    const url =
      'https://recipe-by-api-ninjas.p.rapidapi.com/v1/recipe?query=italian%20wedding%20soup';
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '5f75410f4emshf143142155a6dd7p101489jsn46223137d60a',
        'X-RapidAPI-Host': 'recipe-by-api-ninjas.p.rapidapi.com',
      },
    };

    try {
      const response = await fetch(url, options);
      const result = await response.text();
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchImages = async query => {
    const SHUTTERSTOCK_API_ENDPOINT = 'https://api.shutterstock.com/v2';
    try {
      const response = await fetch(
        `${SHUTTERSTOCK_API_ENDPOINT}/images/search?query=${query}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${constants.shutterstock_Token}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      const data = await response.json();
      if (!!data) {
        console.log('data: ', data?.data[0]?.assets);
      }
    } catch (error) {
      console.log('Error fetching images:', error);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={{backgroundColor: '#12212F'}}>
          <ImageBackground
            source={
              !!userImage ? {uri: userImage} : require('../assets/men.jpg')
            }
            style={styles.imageContainer}
            imageStyle={{opacity: 0.4}}>
            <View
              style={[
                styles.iconsContainer,
                {paddingTop: Platform.OS === 'android' ? 14 : insets.top},
              ]}>
              <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <Image
                  source={require('../assets/menus.png')}
                  style={[styles.icons, {width: 22, height: 22}]}
                />
              </TouchableOpacity>

              <Text style={styles.profileTxt}>
                {auth()?.currentUser?.displayName}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(navigationStrings.SEARCH_SCREEN)
                }>
                <Image
                  source={require('../assets/tab_search.png')}
                  style={styles.icons}
                />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => setShowImageModal(true)}>
            {/* <FastImage
              source={
                !!userImage ? {uri: userImage} : require('../assets/men.jpg')
              }
              style={styles.profileImage}
            /> */}
            {/* <Animated.Image
              style={[styles.profileImage, {transform: [{rotate: spin}]}]}
              source={
                !!userImage ? {uri: userImage} : require('../assets/men.jpg')
              }
            /> */}
            <CachedImage uri={userImage} style={styles.profileImage} />
          </TouchableOpacity>
        </View>
        <View style={{alignItems: 'center', marginTop: 20}}>
          <Text style={styles.profileTxt} selectable>
            {auth().currentUser?.email}
          </Text>
          {/* <Text style={styles.profileTxt}>
            Hello my name is awais and i am {'\n'}a react native student from{' '}
            {'\n'}
            sadiqabad i also study in kfueit.
          </Text> */}
          <TouchableOpacity>
            {/* <FastImage
              style={{
                width: 100,
                height: 100,
                borderRadius: 100,
                marginTop: 20,
              }}
              source={{
                uri: 'https://images.pexels.com/photos/20860153/pexels-photo-20860153/free-photo-of-wave-in-a-sea-in-black-and-white.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
              }}
            /> */}
            {/* <Animated.Image
              style={{
                height: 100,
                width: 100,
                marginVertical: 30,
                transform: [{rotate: spin}],
              }}
              source={{
                uri: 'https://cdn.pixabay.com/photo/2013/07/13/10/51/football-157930_960_720.png',
              }}
            /> */}
            {/* <Animated.Image
              style={{
                height: 100,
                width: 100,
                borderRadius: 100,
                transform: [{rotate: spin}],
              }}
              source={{
                uri: 'https://images.pexels.com/photos/20860153/pexels-photo-20860153/free-photo-of-wave-in-a-sea-in-black-and-white.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
              }}
            /> */}
          </TouchableOpacity>
          {/* <ButtonComponent title="chat gpt" style={styles.btn} onPress={{}} /> */}
          {/* <FastImage
            source={{uri: 'https://v2.exercisedb.io/image/I4XMjCBFhqaGoJ'}}
            style={{width: 200, height: 200, marginTop: 20, borderRadius: 12}}
          /> */}
        </View>

        <Modal visible={showImageModal} style={{flex: 1}} transparent>
          <TouchableOpacity
            activeOpacity={1}
            style={{
              flex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              justifyContent: 'center',
            }}
            onPress={() => setShowImageModal(false)}>
            <TouchableOpacity activeOpacity={1} style={styles.modalStyle}>
              <FastImage
                source={
                  !!userImage ? {uri: userImage} : require('../assets/men.jpg')
                }
                style={styles.modalImageStyle}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      </View>
      <MyIndicatorLoader visible={loading} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.moviesBg,
  },
  imageContainer: {
    height: screenHeight * 0.25,
    width: screenWidth,
    backgroundColor: 'transparent',
  },
  icons: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: colors.white,
    opacity: 1,
  },
  profileTxt: {
    fontSize: 14,
    color: colors.white,
    fontFamily: fontFamily.rubik_bold,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.borderColor,
    marginTop: '-12%',
  },
  uploadImgContainer: {
    width: getResponsiveWidth(30),
    height: getResponsiveHeight(14),
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.borderColor,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 2.22,

    elevation: 5,
    marginRight: 8,
  },
  uploadImg: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    tintColor: colors.lightBlack,
  },
  imageUploadContainer: {
    marginTop: 20,
    paddingLeft: 12,
    flexDirection: 'row',
    // backgroundColor: 'red',
  },
  selectedimage: {
    width: getResponsiveWidth(30),
    height: getResponsiveHeight(14),
    borderRadius: 12,
  },
  closeIcon: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
    tintColor: colors.LightWhite,
  },
  closeIconContainer: {
    backgroundColor: colors.gray,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    position: 'absolute',
    top: 6,
    right: 4,
  },
  btn: {
    width: '40%',
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 22,
    backgroundColor: colors.blue2,
  },
  modalStyle: {
    width: screenWidth,
    paddingVertical: 10,
    shadowColor: '#ffff',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,

    elevation: 12,
  },
  modalImageStyle: {
    width: '100%',
    height: screenHeight * 0.26,
    borderRadius: 12,
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 50,
    borderRightWidth: 50,
    borderBottomWidth: 100,
    borderStyle: 'solid',
    borderBottomColor: 'green',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
});
