import {
  View,
  StyleSheet,
  FlatList,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../navigation/navigationStrings';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import Animated, {FadeInDown, FadeInLeft} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LoadingComponent from '../components/LoadingComponent';
import LinearGradient from 'react-native-linear-gradient';
import {getResponsiveMargin} from '../utils/getResponsiveMarginPadding';
import MyIndicator from '../components/MyIndicator';
import constants from '../constants/constants';
import FastImage from 'react-native-fast-image';
import {FlashList} from '@shopify/flash-list';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function NotificationScreen() {
  const navigation = useNavigation();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    fetchPhotos();
  }, []);
  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://api.pexels.com/v1/curated', {
        headers: {
          Authorization: constants.pexelApiKey,
        },
      });
      if (!response.ok) {
        setLoading(false);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setPhotos(data.photos);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching photos:', error);
    }
  };

  if (loading) {
    return <LoadingComponent />;
  }

  const renderItem = ({item, index}) => {
    const time = Date.now();

    return (
      <Animated.View
        entering={FadeInDown.delay(index * 100)
          .duration(2000)
          .springify()
          .damping(8)}>
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(navigationStrings.Detail_Photo_Screen, {
                data: item,
              })
            }>
            <FastImage
              source={{uri: item?.src?.landscape}}
              style={styles.image}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  return (
    <>
      <View style={{flex: 1, backgroundColor: colors.moviesBg}}>
        <StatusBar barStyle={'light-content'} backgroundColor={'black'} />
        <View
          style={[
            styles.container,
            {paddingTop: Platform.OS === 'ios' ? insets.top - 6 : 0},
          ]}>
          <View style={{flex: 1, minHeight: 2}}>
            <FlashList
              data={photos}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              estimatedItemSize={60}
            />
          </View>
        </View>
      </View>
      <MyIndicator visible={loading} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    color: colors.lineColor,
    fontFamily: fontFamily.lato_bold,
    marginVertical: 8,
    alignSelf: 'center',
  },
  image: {
    width: screenWidth,
    height: screenHeight / 4,
    resizeMode: 'contain',
  },
  fastImgLoadingStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
