import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import colors from '../styles/colors';
import FastImage from 'react-native-fast-image';
import fontFamily from '../styles/fontFamily';

const CoffeeCardCompo = ({item, onPress}) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <FastImage
          source={{uri: item?.image}}
          style={styles.image}
          defaultSource={require('../assets/food/picture.png')}
        />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.heading}>{item?.name}</Text>
        <View style={styles.starConatiner}>
          <Image
            source={require('../assets/coffee/star.png')}
            style={styles.starIcon}
          />
          <Text style={styles.starTxt}>{item?.stars}</Text>
        </View>
        <Text style={styles.volumeTxt}>
          <Text style={{color: colors.whiteOpacity70}}>Volume</Text>{' '}
          {' ' + item?.volume} ml
        </Text>
      </View>
      <View style={styles.bottomView}>
        <View style={styles.row}>
          <Text style={styles.txtPrice}>$ {item?.price}</Text>
          <TouchableOpacity style={styles.plusIconContainer} onPress={onPress}>
            <Image
              source={require('../assets/coffee/add.png')}
              style={styles.plusIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.coffee_Dark_Brown,
    borderRadius: 40,
    height: 350,
    width: 250,
  },
  image: {
    width: '60%',
    aspectRatio: 1,
    overflow: 'hidden',
    borderRadius: 1000,
  },
  imageContainer: {
    shadowColor: colors.black,
    shadowRadius: 30,
    shadowOffset: {width: 0, height: 40},
    shadowOpacity: 0.8,
    alignItems: 'center',
    marginTop: 14,
  },
  heading: {
    fontSize: 20,
    color: colors.LightWhite,
    fontFamily: fontFamily.rubik_bold,
  },
  contentContainer: {
    paddingHorizontal: 20,
    marginTop: 14,
  },
  starTxt: {
    color: colors.white,
  },
  starIcon: {
    width: 14,
    height: 14,
    tintColor: colors.white,
    marginRight: 6,
  },
  starConatiner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.weather_Search_Bg,
    width: '30%',
    paddingVertical: 6,
    justifyContent: 'center',
    borderRadius: 22,
    marginVertical: 12,
  },
  volumeTxt: {
    fontSize: 14,
    color: colors.white,
    fontWeight: '600',
  },
  bottomView: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 22,
    marginBottom: 20,
  },
  txtPrice: {
    fontSize: 14,
    fontFamily: fontFamily.rubik_semi_bold,
    color: colors.LightWhite,
  },
  plusIcon: {
    width: 24,
    height: 24,
    tintColor: colors.coffee_Dark_Brown,
  },
  plusIconContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.LightWhite,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default CoffeeCardCompo;
