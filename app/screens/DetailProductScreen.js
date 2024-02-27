import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Button,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import ScreenComponent from '../components/ScreenComponent';
import fontFamily from '../styles/fontFamily';
import colors from '../styles/colors';
import TopCompoWithHeading from '../components/TopCompoWithHeading';
import Animated from 'react-native-reanimated';
import DocumentPicker from 'react-native-document-picker';
import ButtonComponent from '../components/ButtonComponent';
import FastImage from 'react-native-fast-image';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function DetailProductScreen({route}) {
  const navigation = useNavigation();
  const routeData = route?.params?.data;
  const [allDocuments, setAllDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  const uploadData = async allMedia => {
    setLoading(true);
    try {
      let allUrls = [];
      await Promise.all(
        allMedia.map(async media => {
          try {
            let blobMedia = await uriToBlob(media.uri);
            const timestamp = Date.now();
            const mediaID = `testDocs_${timestamp}`;
            let mediaTy = media.type;
            const fileType = mediaTy.substring(mediaTy.lastIndexOf('/') + 1);

            const imageRef = storage()
              .ref()
              .child(`testDocuments/${mediaID}.${fileType}`);
            await imageRef.put(blobMedia); // Use put() instead of putFile()
            const downloadURL = await imageRef.getDownloadURL();
            allUrls.push(downloadURL);
          } catch (error) {
            console.error('Error fetching or uploading documents:', error);
          }
        }),
      );
      setLoading(false);
      console.log('downloaded urls: ', allUrls);
    } catch (error) {
      console.error('Error uploading documents: ', error);
      setLoading(false);
    }
  };

  const uriToBlob = uri => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        // return the blob
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new Error('uriToBlob failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);

      xhr.send(null);
    });
  };

  const handleDocumentPicker = async () => {
    try {
      const results = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        presentationStyle: 'fullScreen',
        transitionStyle: 'flipHorizontal',
        allowMultiSelection: true,
      });
      let temArr = [];
      for (const res of results) {
        let newUri = res?.uri;
        let type = res?.type;
        temArr.push({uri: newUri, type: type});
      }
      if (temArr.length > 0) {
        setAllDocuments(temArr);
      }
    } catch (error) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert('User Canceled doc picker!');
      } else {
        //For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
      console.log('Error while picking document: ', error);
    }
  };

  const showUris = () => {
    console.log('Data in useState: ', allDocuments);
    let img = allDocuments[0];
    let imgTy = img.type;
    const fileType = imgTy.substring(imgTy.lastIndexOf('/') + 1);
    console.log(fileType);
  };

  const handleUpoadData = async () => {
    try {
      await uploadData(allDocuments);
      // console.log('all urls: ', allDocuments);
    } catch (error) {
      console.log('Error in uploading data : ', error);
    }
  };

  return (
    <>
      <ScreenComponent
        style={{backgroundColor: routeData?.avg_color || colors.moviesBg}}>
        <TopCompoWithHeading
          title="Detail"
          onPress={() => navigation.goBack()}
        />
        <View style={{flex: 1, marginBottom: 20}}>
          {isLoading && (
            <View style={styles.placeholder}>
              <ActivityIndicator size="large" color={colors.black} />
            </View>
          )}
          <FastImage
            source={{uri: routeData?.src?.portrait}}
            style={styles.image}
            resizeMode={'cover'}
            onLoadStart={handleLoadStart}
            onLoadEnd={handleLoadEnd}
          />
        </View>
        {/* <View
          style={{
            marginVertical: 20,
            paddingHorizontal: 20,
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            style={styles.docuIconContainer}
            onPress={handleDocumentPicker}>
            <Image
              source={require('../assets/ic_document.png')}
              style={styles.docuIcon}
            />
          </TouchableOpacity>
          <FlatList
            data={allDocuments}
            renderItem={({item}) => {
              console.log('item is :', item);
              return (
                <View style={{marginLeft: 8}}>
                  <FastImage
                    source={{uri: item.uri}}
                    style={styles.myimage}
                    onError={() => console.log('Error loading image')}
                  />
                </View>
              );
            }}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
        <ButtonComponent
          title="show data"
          style={styles.btn1}
          onPress={showUris}
        />
        <ButtonComponent
          title="Upload data"
          style={styles.btn}
          onPress={handleUpoadData}
          loading={loading}
        /> */}
      </ScreenComponent>
    </>
  );
}

const styles = StyleSheet.create({
  container: {},
  txt: {
    fontSize: 20,
    alignSelf: 'center',
    marginVertical: 10,
    fontFamily: fontFamily.lato_bold,
    color: colors.darkBlue,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  docuIconContainer: {
    width: 90,
    height: 90,
    borderRadius: 6,
    backgroundColor: colors.grey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docuIcon: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
    tintColor: colors.black,
  },
  btn: {
    backgroundColor: colors.purple,
    width: '50%',
    alignSelf: 'center',
    marginVertical: 12,
  },
  btn1: {
    backgroundColor: colors.darkBlue,
    width: '50%',
    alignSelf: 'center',
    marginVertical: 12,
  },
  myimage: {
    width: 90,
    height: 90,
    borderRadius: 8,
  },
  placeholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
