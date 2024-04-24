import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
import Animated from 'react-native-reanimated';

export const CachedImage = props => {
  const [cachedStore, setCachedStore] = useState(null);
  const {uri} = props;

  useEffect(() => {
    const getCachedImage = async () => {
      try {
        const cachedImageData = await AsyncStorage.getItem(uri);
        if (cachedImageData) {
          setCachedStore({uri: cachedImageData});
        } else {
          const response = await fetch(uri);
          const imageBlob = await response.blob();
          const base64Data = await new Promise(resolve => {
            const reader = new FileReader();
            reader.readAsDataURL(imageBlob);
            reader.onloadend = () => {
              resolve(reader.result);
            };
          });
          await AsyncStorage.setItem(uri, base64Data);
          setCachedStore({uri: base64Data});
        }
      } catch (error) {
        console.log('Error in getCachedImage in CachedImage file: ', error);
        setCachedStore({uri});
      }
    };

    getCachedImage();
  }, []);

  return <Animated.Image source={cachedStore} {...props} />;
};
