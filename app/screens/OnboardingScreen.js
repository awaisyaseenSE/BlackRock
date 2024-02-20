import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  Image,
  Dimensions,
  FlatList,
  Animated,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import React, {useRef, useState} from 'react';
import fontFamily from '../styles/fontFamily';
import colors from '../styles/colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StackActions, useNavigation} from '@react-navigation/native';
import {getResponsivePadding} from '../utils/getResponsiveMarginPadding';
import {storeValue} from '../helper/storeAndGetAsyncStorageValue';
import FastImage from 'react-native-fast-image';

const screenWidth = Dimensions.get('screen').width;

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const ref = useRef();
  const [currentIndex, setcurrentIndex] = useState(0);
  const scrollx = useRef(new Animated.Value(0)).current;

  const data = [
    {
      img: require('../assets/poster-1.jpeg'),
      imgURL:
        'https://www.joblo.com/wp-content/uploads/2017/10/Black-Panther-poster-main-xl-1.jpg',
      title: 'If you looking for latest movies',
      subtitle: [
        'No border and no crown completely free to view!',
        'No border with gold crown only address and name hidden from non-premium members',
        'Gold border with black crown premium member exclusive - all information hidden from non premium members',
      ],
    },
    {
      img: require('../assets/poster-2.jpg'),
      imgURL: 'https://wallpapercave.com/wp/wp11149567.jpg',
      title: 'Welcome To Best Movies',
      subtitle: [
        'Welcome To Best Movies',
        '“Near me” are the locations closest to you, ordered by their distance from your current location!',
        '“ As seen on social media” are the locations we have recently posted on any of our social medias so they are easy to find!',
        '“Featured: Category” is the featured category for that month and is selected based on the season or what has gained popularity on our app in recent times.',
        '“Recently Added” are locations that we have recently added to the app.',
        '“Visited Places” is a collection of all the locations that you have identified that you have visited already!',
      ],
    },
    {
      img: require('../assets/poster-3.jpg'),
      imgURL:
        'https://m.media-amazon.com/images/M/MV5BNzZmOTU1ZTEtYzVhNi00NzQxLWI5ZjAtNWNhNjEwY2E3YmZjXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg',
      title: 'Only With Us Only For You',
      subtitle: [
        'Search for location titles using the search bar',
        'View all locations or select one you would like to browse!',
        'Use the “Sort By” filter to order it alphabetically, newest to oldest, oldest to newest, or filter it by state!',
      ],
    },
    {
      img: require('../assets/poster-4.jpg'),
      imgURL:
        'https://cdnb.artstation.com/p/assets/images/images/034/972/411/large/khushal-sharma-avatar-movie-poster.jpg?1613744215',
      title: 'Real Time',
      subtitle: [
        'This is where you can view all the locations on our app, spread across the entire country!',
        'Filter locations by selecting any specific category',
        'Click on any location marker to see a preview of the location before clicking it to read more about it.',
      ],
    },
  ];

  const Indicators = ({data, scrollx}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          height: 30,
          alignSelf: 'center',
        }}>
        {data.map((_, i) => {
          const inputRange = [
            (i - 1) * screenWidth,
            i * screenWidth,
            (i + 1) * screenWidth,
          ];
          const dotWidth = scrollx.interpolate({
            inputRange,
            outputRange: [10, 30, 10],
            extrapolate: 'clamp',
          });
          const opacity = scrollx.interpolate({
            inputRange,
            outputRange: [0.8, 1, 0.8],
            extrapolate: 'clamp',
          });
          const scalex = scrollx.interpolate({
            inputRange,
            outputRange: [0.2, 1.4, 0.2],
            extrapolate: 'clamp',
          });
          colorInterpolate = scalex.interpolate({
            inputRange: [0, 1],
            outputRange: [colors.gray, colors.lightBlack],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              style={{
                width: dotWidth,
                height: 10,
                borderRadius: 5,
                backgroundColor: colorInterpolate,
                marginHorizontal: 3,
                opacity: opacity,
              }}
              key={i.toString()}
            />
          );
        })}
      </View>
    );
  };

  const handleSwipe = direction => {
    let newIndex = currentIndex;
    if (direction === 'next') {
      newIndex = Math.min(currentIndex + 1, data.length - 1);
    } else if (direction === 'previous') {
      newIndex = Math.max(currentIndex - 1, 0);
    }
    ref?.current?.scrollToOffset({
      offset: newIndex * screenWidth,
      animated: true,
    });
    setcurrentIndex(newIndex);
  };

  const renderItem = ({item}) => {
    return (
      <Animated.View style={styles.mainContainer}>
        {/* <Image resizeMode="contain" style={styles.image} source={item.img} /> */}
        <ImageBackground
          style={styles.image}
          source={item.img}
          borderRadius={12}>
          {/* <FastImage
            source={{
              uri: item?.imgURL,
            }}
            style={styles.image}
          /> */}
        </ImageBackground>
        <Text style={styles.title}>{item.title}</Text>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={item.subtitle}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => {
            return (
              <View
                style={[
                  styles.txtDotView,
                  {width: Dimensions.get('screen').width},
                ]}>
                <View style={styles.txtDot} />
                <Text style={styles.subtitle}>{item}</Text>
              </View>
            );
          }}
        />
      </Animated.View>
    );
  };

  const handleFinishOnBoarding = async () => {
    try {
      console.log('Finish on boarding func is called!');
      let key = 'onBoarding';
      await storeValue(key, 'true');
      // navigation.navigate('MainTabRoutes');
      navigation.dispatch(StackActions.replace('MainTabRoutes'));
    } catch (error) {
      console.log('Error in finish on boarding screen function: ', error);
    }
  };

  return (
    <>
      <StatusBar barStyle={'light-content'} backgroundColor={'black'} />
      <View
        style={[
          styles.container,
          {paddingTop: Platform.OS === 'android' ? 20 : insets.top},
        ]}>
        <View style={{paddingHorizontal: 20, flexDirection: 'row'}}>
          <TouchableOpacity
            style={styles.skipBtn}
            onPress={handleFinishOnBoarding}>
            <Text style={styles.skipTxt}>Skip</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          ref={ref}
          data={data}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          scrollEventThrottle={32}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: scrollx}}}],
            {useNativeDriver: false},
          )}
          onMomentumScrollEnd={ev => {
            const currentIndex = Math.floor(
              ev.nativeEvent.contentOffset.x / screenWidth,
            );
            setcurrentIndex(currentIndex);
          }}
          renderItem={renderItem}
        />
        <View style={styles.dotContainer}>
          <Indicators scrollx={scrollx} data={data} />
        </View>
        <View
          style={{
            marginBottom: Platform.OS === 'android' ? 20 : insets.bottom,
          }}>
          <View style={styles.bottomView}>
            {currentIndex > 0 ? (
              <TouchableOpacity
                onPress={() => {
                  handleSwipe('previous');
                }}
                style={styles.bottomButton}>
                <Text style={[styles.btnText, {color: colors.black}]}>
                  Previous
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.emptyBottomButton} />
            )}

            <TouchableOpacity
              style={[styles.bottomButton, {backgroundColor: '#8B8000'}]}
              onPress={() => {
                if (currentIndex < data.length - 1) {
                  handleSwipe('next');
                } else {
                  handleFinishOnBoarding();
                }
              }}>
              <Text style={[styles.btnText, {color: colors.lightOffWhite}]}>
                {currentIndex < data.length - 1 ? 'Next' : 'Finish'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bottomTabBg,
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    width: screenWidth,
    paddingVertical: getResponsivePadding(12),
  },
  image: {
    width: screenWidth * 0.8,
    height: screenWidth * 0.8,
    borderRadius: 12,
    resizeMode: 'contain',
    shadowColor: colors.lineColor,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
  },
  img: {
    maxHeight: '80%',
    maxWidth: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: fontFamily.rubik_bold,
    color: colors.lineColor,
    marginVertical: 12,
  },
  subtitle: {
    marginLeft: 10,
    color: colors.lightBlackTwo,
    fontFamily: fontFamily.rubik_medium,
  },
  txtDotView: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginTop: 7,
    marginBottom: 7,
  },
  txtDot: {
    height: 10,
    width: 10,
    borderRadius: 6,
    marginTop: 4,
    backgroundColor: colors.lightBlack,
  },
  dotContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  dots: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
  emptyBottomButton: {
    height: 40,
    width: '30%',
    borderRadius: 5,
  },
  btnText: {
    fontSize: 16,
  },
  bottomButton: {
    height: 40,
    width: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray,
    borderRadius: 5,
    shadowColor: colors.gray,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2.84,

    elevation: 5,
  },
  bottomView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  skipTxt: {
    fontFamily: fontFamily.rubik_medium,
    fontSize: 14,
    color: colors.black,
  },
  skipBtn: {
    paddingHorizontal: 28,
    paddingVertical: 12,
    backgroundColor: colors.gray,
    borderRadius: 6,
    shadowColor: colors.lineColor,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2.84,

    elevation: 5,
  },
  imageContainer: {
    shadowColor: colors.lightBlackTwo,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,

    elevation: 14,
  },
  myimage: {
    shadowColor: colors.lightBlackTwo,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
  },
});
