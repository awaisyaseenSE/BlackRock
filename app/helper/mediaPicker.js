import {Alert} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';

export const pickImage = () => {
  return new Promise((resolve, reject) => {
    const options = {
      title: 'Select Photo',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      mediaType: 'mixed',
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response?.assets[0]?.uri) {
        let res = response?.assets[0];
        // resolve(res);
        if (res?.fileSize) {
          // console.log('sdskdjfsdflks');
          const fileSizeInBytes = res?.fileSize;
          const fileSizeInMB = fileSizeInBytes / (1024 * 1024); // here i convert bytes into mb
          if (fileSizeInMB > 5) {
            Alert.alert(
              'File Size Exceeded',
              'Selected image exceeds 5MB. Please select a smaller image.',
            );
            return null;
          }
          resolve(res);
        }
      } else {
        console.log('Image is not selected!');
      }
    });
  });
};
