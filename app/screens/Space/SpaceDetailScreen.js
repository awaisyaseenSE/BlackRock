import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Platform,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import ScreenComponent from '../../components/ScreenComponent';
import colors from '../../styles/colors';
import fontFamily from '../../styles/fontFamily';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../../navigation/navigationStrings';
import FastImage from 'react-native-fast-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const {width, height} = Dimensions.get('window');

export default function SpaceDetailScreen({route}) {
  const navigation = useNavigation();
  const data = route?.params?.data;
  const insets = useSafeAreaInsets();

  const generateStars = (numStars = 36) => {
    let stars = [];
    for (let i = 0; i < numStars; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      stars.push({x, y});
    }
    return stars;
  };

  const stars = generateStars();

  return (
    <>
      <View
        style={[
          styles.mainContainer,
          {
            paddingTop: Platform.OS === 'android' ? 10 : insets.top,
          },
        ]}>
        <View style={styles.topContainer}>
          <TouchableOpacity
            style={styles.backIconContainer}
            onPress={() => navigation.goBack()}>
            <Image
              source={require('../../assets/back.png')}
              style={styles.backIcon}
            />
          </TouchableOpacity>
          {stars &&
            stars.map((star, index) => (
              <Image
                key={index}
                source={require('../../assets/space/star.png')}
                style={{
                  position: 'absolute',
                  left: star.x,
                  bottom: star.y,
                  width: index % 2 == 0 ? 6 : 4,
                  height: index % 2 == 0 ? 6 : 4,
                  zIndex: 20,
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: 100,
                }}
                resizeMode="contain"
              />
            ))}
          <FastImage
            source={data?.img}
            style={styles.img}
            resizeMode="contain"
          />
        </View>
        <View
          style={[
            styles.container,
            {
              paddingBottom: Platform.OS === 'android' ? 14 : insets.bottom,
            },
          ]}>
          <View style={styles.row}>
            <Text style={styles.heading}>{data?.title}</Text>
            <TouchableOpacity>
              <Image
                source={require('../../assets/heart-empty.png')}
                style={styles.heart}
              />
            </TouchableOpacity>
          </View>
          <View style={{flex: 1}}>
            <ScrollView
              style={{flex: 1, marginBottom: 14}}
              showsVerticalScrollIndicator={false}>
              <Text selectable style={styles.desc}>
                {data?.desc}
              </Text>
            </ScrollView>
          </View>
          <Text style={styles.auther}>By Daisy Stephenson | 02 May 2023</Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colors.space_black1,
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.space_black2,
    paddingTop: 30,
    paddingHorizontal: 24,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  topContainer: {
    width: '100%',
    height: height / 2.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: '80%',
    aspectRatio: 1.5,
    alignSelf: 'center',
  },
  heading: {
    fontSize: 26,
    color: colors.offWhite,
    fontFamily: fontFamily.rubik_semi_bold,
  },
  row: {
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heart: {
    width: 24,
    height: 24,
    tintColor: colors.space_pink,
  },
  desc: {
    fontSize: 14,
    color: colors.whiteOpacity70,
    fontFamily: fontFamily.rubik_medium,
    lineHeight: 22,
    textAlign: 'justify',
  },
  auther: {
    fontSize: 15,
    color: '#787878',
    fontFamily: fontFamily.rubik_regular,
  },
  backIcon: {
    width: 18,
    height: 18,
    tintColor: colors.whiteOpacity70,
  },
  backIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: colors.whiteOpacity70,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 8,
    left: 22,
  },
});
