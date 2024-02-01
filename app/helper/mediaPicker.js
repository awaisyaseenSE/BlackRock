import {launchImageLibrary} from 'react-native-image-picker';

export const pickImage = () => {
  return new Promise((resolve, reject) => {
    const options = {
      title: 'Select Photo',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
        reject(new Error('User cancelled image picker'));
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        reject(new Error(response.error));
      } else if (response?.assets[0]?.uri) {
        let uri = response?.assets[0]?.uri;
        resolve(uri);
      } else {
        console.log('Image is not selected!');
        reject(new Error('Image is not selected'));
      }
    });
  });
};
