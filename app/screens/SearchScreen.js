import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Platform,
  StatusBar,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import ScreenComponent from '../components/ScreenComponent';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import ButtonComponent from '../components/ButtonComponent';
import useAuth from '../auth/useAuth';
import constants from '../constants/constants';
import MyIndicator from '../components/MyIndicator';
import FastImage from 'react-native-fast-image';
import {
  getResponsiveHeight,
  getResponsiveMargin,
} from '../utils/getResponsiveMarginPadding';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../navigation/navigationStrings';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInLeft,
  FadeInRight,
  FadeInUp,
} from 'react-native-reanimated';
import LoadingComponent from '../components/LoadingComponent';

export default function SearchScreen() {
  const {logout} = useAuth();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

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

  const renderItem = ({item, index}) => {
    const time = Date.now();
    return (
      <Animated.View
        entering={FadeInDown.delay(index * 100)
          .duration(2000)
          .springify()
          .damping(8)}
        // style={{marginVertical: getResponsiveMargin(6)}}
      >
        <View style={{alignItems: 'center'}}>
          {/* <Text style={styles.heading}>{item?.photographer}</Text> */}
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(navigationStrings.DETAIL_PRODUCT_ROUTES, {
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
  const renderItemOne = ({item}) => {
    return (
      <View style={{marginVertical: getResponsiveMargin(6)}}>
        <FastImage
          source={{uri: item?.src?.landscape}}
          style={{width: screenWidth, height: getResponsiveHeight(20)}}
        />
      </View>
    );
  };

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <>
      <StatusBar barStyle={'light-content'} backgroundColor={'black'} />
      <LinearGradient
        start={{x: 1, y: 0}}
        end={{x: 0, y: 1}}
        colors={['#313131', '#262626', '#131313']}
        style={{flex: 1}}>
        <View
          style={[
            styles.container,
            {paddingTop: Platform.OS === 'ios' ? insets.top - 6 : 0},
          ]}>
          <View style={{marginBottom: getResponsiveMargin(6)}} />
          <FlatList
            data={photos}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </LinearGradient>
      <MyIndicator visible={loading} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 40,
  },
  heading: {
    fontSize: 20,
    color: colors.blue,
    fontFamily: fontFamily.lato_bold,
  },
  btn: {
    width: '60%',
    borderRadius: 12,
    marginBottom: 30,
    alignSelf: 'center',
    marginTop: 8,
  },
  image: {
    width: screenWidth,
    height: screenHeight / 4,
    resizeMode: 'contain',
  },
  TopImage: {
    width: '100%',
    height: getResponsiveHeight(14),
    resizeMode: 'contain',
  },
  profileImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  drawerIconContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  drawerIcon: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
    tintColor: colors.white,
  },
});
