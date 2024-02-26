import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import colors from '../styles/colors';
import FastImage from 'react-native-fast-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ActivityIndicator} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function DetailPhotoScreen({route}) {
  const navigation = useNavigation();
  const photoData = route?.params?.data;
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  return (
    <>
      <View
        style={[
          styles.container,
          {backgroundColor: photoData?.avg_color || colors.moviesBg},
        ]}>
        {isLoading && (
          <View style={styles.placeholder}>
            <ActivityIndicator size="large" color={colors.black} />
          </View>
        )}
        <FastImage
          source={{uri: photoData?.src?.portrait}}
          style={styles.imageStyle}
          resizeMode="contain"
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
        />
        <TouchableOpacity
          style={[
            styles.iconContainer,
            {
              top: Platform.OS === 'ios' ? insets.top : 14,
            },
          ]}
          onPress={() => navigation.goBack()}>
          <Image
            source={require('../assets/backward.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageStyle: {
    width: screenWidth,
    height: screenHeight,
    resizeMode: 'cover',
  },
  icon: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
    tintColor: colors.LightWhite,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.black,
    position: 'absolute',
    left: 20,
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
