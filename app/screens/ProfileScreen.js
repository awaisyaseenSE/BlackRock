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
} from 'react-native';
import React, {useState} from 'react';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {
  getResponsiveHeight,
  getResponsiveWidth,
} from '../utils/getResponsiveMarginPadding';
import {launchImageLibrary} from 'react-native-image-picker';
import {pickImage} from '../helper/mediaPicker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import ButtonComponent from '../components/ButtonComponent';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import {removeItemValue} from '../helper/storeAndGetAsyncStorageValue';
import navigationStrings from '../navigation/navigationStrings';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [selectedImage, setSelectedImage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [medialUrls, setMediaUrls] = useState([]);
  const navigation = useNavigation();
  const userImage = auth()?.currentUser?.photoURL;

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
      let key = 'todoItems';
      await removeItemValue(key);
      // navigation.navigate('MainTabRoutes');
    } catch (error) {
      console.log('Error in finish on boarding screen function: ', error);
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
          <FastImage
            source={
              !!userImage ? {uri: userImage} : require('../assets/men.jpg')
            }
            style={styles.profileImage}
          />
        </View>
        <View style={{alignItems: 'center', marginTop: 20}}>
          <Text style={styles.profileTxt}>{auth().currentUser?.email}</Text>
        </View>
        {/* <ScrollView
          style={styles.imageUploadContainer}
          horizontal
          showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={styles.uploadImgContainer}
            onPress={handleSelectImages}>
            <Image
              source={require('../assets/camera.png')}
              style={styles.uploadImg}
            />
          </TouchableOpacity>
          <FlatList
            data={selectedImage}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
          />
        </ScrollView>
        <View style={{flex: 1, paddingHorizontal: 40}}>
          {selectedImage.length > 0 && (
            <ButtonComponent
              title="Uplaod Images"
              onPress={() => uploadImages(selectedImage)}
              loading={loading}
              style={{marginBottom: 12}}
            />
          )}
        </View> */}
      </View>
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
    width: '60%',
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 8,
  },
});
