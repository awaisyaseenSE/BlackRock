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
  FlatList,
  PermissionsAndroid,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import {pickImage} from '../helper/mediaPicker';
import {useNavigation} from '@react-navigation/native';
import {
  ColorMatrix,
  concatColorMatrices,
  tint,
  vintage,
  sepia,
  grayscale,
  night,
  nightvision,
  warm,
  cool,
  polaroid,
  browni,
  protanomaly,
  tritanomaly,
  normal,
  invert,
  brightness,
  contrast,
  temperature,
} from 'react-native-color-matrix-image-filters';
import ScreenComponent from '../components/ScreenComponent';
import TopCompoWithHeading from '../components/TopCompoWithHeading';
import ButtonComponent from '../components/ButtonComponent';
import Slider from '@react-native-community/slider';
import ViewShot, {captureScreen, captureRef} from 'react-native-view-shot';
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function PhotoEditingScreen() {
  const navigation = useNavigation();
  const [selectedPhoto, setSelectedPhoto] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(null);

  const [brightnessValue, setBrightnessValue] = useState(null);
  const [contrastValue, setContrastValue] = useState(null);
  const [temperatureValue, setTemperatureValue] = useState(null);
  const [touchStartBrightness, setTouchStartBrightness] = useState(false);
  const [touchStartContrast, setTouchStartContrast] = useState(false);
  const [touchStartTemp, setTouchStartTemp] = useState(false);

  const screenShotRef = useRef(null);

  const editingData = [
    {
      id: 0,
      title: 'Original',
      filter: normal(),
    },
    {
      id: 1,

      title: 'Tritanomaly',
      filter: tritanomaly(),
    },
    {
      id: 2,
      title: 'Protanomaly',
      filter: protanomaly(),
    },
    {
      id: 3,

      title: 'Warm',
      filter: warm(),
    },
    {
      id: 4,
      title: 'Cool',
      filter: cool(),
    },
    {
      id: 5,
      title: 'Vintage',
      filter: vintage(),
    },
    {
      id: 6,
      title: 'Grayscale',
      filter: grayscale(),
    },
    {
      id: 7,
      title: 'Polaroid',
      filter: polaroid(),
    },
    {
      id: 8,
      title: 'Browni',
      filter: browni(),
    },
    {
      id: 9,
      title: 'Sepia',
      filter: sepia(),
    },
    {
      id: 10,
      title: 'Invert',
      filter: invert(),
    },
    {
      id: 11,
      title: 'Night',
      filter: night(),
    },
    {
      id: 12,
      title: 'Night Vision',
      filter: nightvision(),
    },
  ];

  const handleBrightnessChange = value => {
    setBrightnessValue(value);
  };

  const handleContrastChange = value => {
    setContrastValue(value);
  };

  const handleTemperatureChange = value => {
    setTemperatureValue(value);
  };

  const applyFilters = () => {
    let filters = [];

    if (selectedFilter) {
      filters.push(selectedFilter);
    } else {
      filters.push(normal());
    }
    if (brightnessValue !== null) {
      filters.push(brightness(brightnessValue));
    }
    if (contrastValue !== null) {
      filters.push(contrast(contrastValue));
    }
    if (temperatureValue !== null) {
      filters.push(temperature(temperatureValue));
    }

    // Concatenate all filters and adjustments
    return filters.length > 0 ? concatColorMatrices(...filters) : normal();
  };

  const handleImagePicker = async () => {
    try {
      let res = await pickImage();
      if (!!res) {
        setSelectedPhoto(res);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        style={{marginRight: 12, width: 110}}
        activeOpacity={0.6}
        onPress={() => {
          setSelectedFilter(item.filter);
        }}>
        <View>
          <ColorMatrix matrix={item.filter}>
            <Image source={{uri: selectedPhoto}} style={styles.flatlistImg} />
          </ColorMatrix>
          <Text style={styles.textStyle1} numberOfLines={1}>
            {item?.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const handleSaveEditedPhoto = () => {
    // screenShotRef.current.capture().then(uri => {
    //   console.log('do something with ', uri);
    // });
    let id = Date.now();
    let myfileName = `Edited_Photo_`;
    captureRef(screenShotRef, {
      format: 'jpg',
      quality: 1.0,
      fileName: myfileName,
    }).then(
      // uri => console.log('Image can be accessed at: ', uri),
      uri => moveImageToDownloads(uri),
      error => console.log('Snapshot failed', error),
    );
  };
  let id = Date.now();
  let fileName = `${id}_editedPhoto`;

  const moveImageToDownloads = async sourceUri => {
    console.log('URI is: ', sourceUri);
    let myid = Date.now();
    let fileName = `EditedPhoto_${myid}.jpg`;
    try {
      if (Platform.OS === 'android') {
        let res = await requestStoragePermission();
        if (!res) {
          return null;
        }
      }

      // Check if the source file exists
      const sourceExists = await RNFS.exists(sourceUri);
      if (!sourceExists) {
        console.log('Source file does not exist');
        return null;
      }

      // Get the destination directory based on the platform
      const destinationDir = Platform.select({
        ios: RNFS.DocumentDirectoryPath,
        android: RNFS.DownloadDirectoryPath,
      });

      // Check if the destination directory exists, if not create it
      const destinationExists = await RNFS.exists(destinationDir);
      if (!destinationExists) {
        await RNFS.mkdir(destinationDir);
      }

      // Move the image to the destination directory
      const destinationPath = `${destinationDir}/${fileName}`;
      await RNFS.moveFile(sourceUri, destinationPath);

      // Show success message
      console.log('Image moved successfully to:', destinationPath);
      Alert.alert(
        'Photo Saved!',
        'Your edited photo is saved in download folder of your phone.',
      );
    } catch (error) {
      console.error('Error moving image:', error);
    }
  };

  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to your storage to save images.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Storage permission granted');
        return true;
      } else {
        console.log('Storage permission denied');
        return false;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  return (
    <ScreenComponent style={{backgroundColor: colors.moviesBg}}>
      <TopCompoWithHeading
        title="Photo Editing"
        onPress={() => navigation.goBack()}
        rightTitle="Save"
        onPressRightTitle={() => handleSaveEditedPhoto()}
      />
      <View style={styles.container}>
        {selectedPhoto !== '' ? (
          <View>
            <ViewShot ref={screenShotRef}>
              <View>
                <ColorMatrix matrix={applyFilters()}>
                  {/* <ColorMatrix matrix={selectedFilter || normal()}> */}
                  <Image
                    source={{uri: selectedPhoto}}
                    style={styles.selectedPhotoSty}
                  />
                </ColorMatrix>
              </View>
            </ViewShot>
            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.crossContainer}
              onPress={() => setSelectedPhoto('')}>
              <Image
                source={require('../assets/close.png')}
                style={styles.cross}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.uploadIconContainer}
            activeOpacity={0.8}
            onPress={handleImagePicker}>
            <View style={{alignItems: 'center'}}>
              <Image
                source={require('../assets/ic_upload_cloud.png')}
                style={styles.uploadIcon}
              />
              <Text style={styles.textStyle}>Select Image</Text>
            </View>
          </TouchableOpacity>
        )}
        {selectedPhoto !== '' && (
          <View style={{flex: 1, marginTop: 12}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.editProTxt}>Brightness</Text>
              <Slider
                style={{flex: 1, marginLeft: 12}}
                minimumValue={0}
                maximumValue={2}
                step={0.1}
                onValueChange={value => {
                  if (value == 0) {
                    handleBrightnessChange(null);
                  } else {
                    handleBrightnessChange(value);
                  }
                }}
                value={brightnessValue}
                thumbTintColor={
                  touchStartBrightness ? colors.yellow : colors.grey
                }
                minimumTrackTintColor={colors.yellow}
                onTouchStart={() => setTouchStartBrightness(true)}
                onTouchEnd={() => setTouchStartBrightness(false)}
              />
              <Text style={styles.txt}>
                {' '}
                {brightnessValue !== null
                  ? Math.floor(brightnessValue * 10)
                  : 0}
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.editProTxt}>Contrast</Text>
              <Slider
                style={{flex: 1, marginLeft: 12}}
                minimumValue={0}
                maximumValue={2}
                step={0.1}
                onValueChange={value => {
                  if (value == 0) {
                    handleContrastChange(null);
                  } else {
                    handleContrastChange(value);
                  }
                }}
                value={contrastValue}
                thumbTintColor={
                  touchStartContrast ? colors.yellow : colors.grey
                }
                minimumTrackTintColor={colors.yellow}
                onTouchStart={() => setTouchStartContrast(true)}
                onTouchEnd={() => setTouchStartContrast(false)}
              />
              <Text style={styles.txt}>
                {' '}
                {contrastValue !== null ? Math.floor(contrastValue * 10) : 0}
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.editProTxt}>Temperature</Text>
              <Slider
                style={{
                  flex: 1,
                  marginLeft: 12,
                }}
                minimumValue={0}
                maximumValue={2}
                step={0.1}
                onValueChange={value => {
                  if (value == 0) {
                    handleTemperatureChange(null);
                  } else {
                    handleTemperatureChange(value);
                  }
                }}
                value={temperatureValue}
                thumbTintColor={touchStartTemp ? colors.yellow : colors.grey}
                minimumTrackTintColor={colors.yellow}
                onTouchStart={() => setTouchStartTemp(true)}
                onTouchEnd={() => setTouchStartTemp(false)}
              />
              <Text style={styles.txt}>
                {' '}
                {temperatureValue !== null
                  ? Math.floor(temperatureValue * 10)
                  : 0}
              </Text>
            </View>
          </View>
        )}
        {selectedPhoto !== '' && (
          <View
            style={{
              height: 110,
            }}>
            <FlatList
              data={editingData}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}
      </View>
    </ScreenComponent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 14,
  },
  uploadIconContainer: {
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.gray,
    marginVertical: 20,
    borderRadius: 8,
    borderStyle: 'dashed',
    backgroundColor: colors.uploadModalBg,
    height: screenHeight * 0.18,
    justifyContent: 'center',
  },
  uploadIcon: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    tintColor: '#072e70',
  },
  textStyle: {
    fontSize: 14,
    fontFamily: fontFamily.lato_bold,
    color: colors.gray,
    marginTop: 4,
    paddingHorizontal: 8,
  },
  selectedPhotoSty: {
    height: undefined,
    width: '100%',
    aspectRatio: 2 / 2,
  },
  cross: {
    width: 10,
    height: 10,
    resizeMode: 'contain',
    tintColor: colors.white,
  },
  crossContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.black,
    position: 'absolute',
    top: 6,
    right: 8,
  },
  flatlistImg: {
    width: 100,
    height: 80,
    borderRadius: 4,
  },
  textStyle1: {
    fontSize: 14,
    fontFamily: fontFamily.rubik_regular,
    color: colors.white,
    marginTop: 4,
    alignSelf: 'center',
  },
  btn: {
    width: '40%',
    borderRadius: 6,
    marginLeft: 8,
    marginBottom: 8,
  },
  editProTxt: {
    fontSize: 14,
    fontFamily: fontFamily.rubik_regular,
    color: colors.white,
    width: '24%',
  },
  txt: {
    fontSize: 14,
    fontFamily: fontFamily.rubik_regular,
    color: colors.white,
  },
});
