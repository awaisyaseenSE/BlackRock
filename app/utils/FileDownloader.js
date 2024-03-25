import {Linking, PermissionsAndroid, Platform, Alert} from 'react-native';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';

const getFileNameFromUrl = url => {
  console.log('url: ', url);
  if (!url || typeof url !== 'string') {
    console.log('Invalid URL:', url);
    return `pixels_photo_${id}.jpg`;
  }
  let id = Date.now();
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  const fileNameWithoutQuery = filename.split('?')[0];
  let ff = fileNameWithoutQuery || `pixels_photo_${id}.jpg`;
  return ff;
};

const downloadIosFile = (url, setDownloadUrlLoading) => {
  if (url == '' || url == undefined) {
    return Alert.alert('file is not download try again!');
  }
  setDownloadUrlLoading(true);
  const fileName = getFileNameFromUrl(url);
  let id = Date.now();
  let finalFileName = '';
  if (fileName?.includes('.mp4')) {
    finalFileName = `${id}_${fileName}`;
  } else {
    finalFileName = fileName;
  }
  const selectedFolder = `${RNFS.DocumentDirectoryPath}`;
  const destinationPath = `${selectedFolder}/${finalFileName}`;
  RNFS.downloadFile({
    fromUrl: url,
    toFile: destinationPath,
  })
    .promise.then(r => {
      setDownloadUrlLoading(false);
      console.log('file saved: ', destinationPath);
      alert('File is Downloaded');
    })
    .catch(er => {
      setDownloadUrlLoading(false);
      console.log(
        'Error in downloading file of ios in Upload file Modal Compo: ',
        er,
      );
    });
};

const downloadAndriodFile = (url, setDownloadUrlLoading) => {
  try {
    if (url == '' || url == undefined) {
      return Alert.alert('file is not download try again!');
    }
    setDownloadUrlLoading(true);
    const {config, fs} = RNFetchBlob;
    const fileName = getFileNameFromUrl(url);
    console.log('filename is: ', fileName);
    const destPath = RNFetchBlob.fs.dirs.DownloadDir + '/' + fileName;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        // Related to the Android only
        useDownloadManager: true,
        notification: true,
        path: destPath,
      },
    };
    config(options)
      .fetch('GET', url)
      .then(res => {
        console.log('<<<', res);
        setDownloadUrlLoading(false);
        Alert.alert('Your file is downloaded!');
      })
      .catch(er => {
        setDownloadUrlLoading(false);
        console.log('error in downloading file: ', er);
      });
  } catch (error) {
    setDownloadUrlLoading(false);
    console.log('error in downloading file...', error);
  }
};

const checkPermissionAndroid = async (url, setDownloadUrlLoading) => {
  try {
    if (Platform.Version < 30) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission Required',
          message: 'App needs access to your storage to download files!',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Once user grant the permission start downloading
        console.log('Storage Permission Granted.');
        downloadAndriodFile(url, setDownloadUrlLoading);
      } else {
        Alert.alert(
          'Storage Permission Required!',
          'Please enable storage permission to download file.',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'Enable',
              onPress: () => {
                Linking.openSettings();
              },
            },
          ],
        );
      }
    } else {
      downloadAndriodFile(url, setDownloadUrlLoading);
    }
  } catch (err) {
    console.log(err);
  }
};

export const handleDownload = (url, setDownloadUrlLoading) => {
  if (Platform.OS === 'ios') {
    downloadIosFile(url, setDownloadUrlLoading);
  } else if (Platform.OS === 'android') {
    checkPermissionAndroid(url, setDownloadUrlLoading);
  } else {
    Alert.alert('Unsupported platform');
  }
};
