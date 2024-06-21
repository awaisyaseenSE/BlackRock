import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Platform,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import colors from '../../styles/colors';
import fontFamily from '../../styles/fontFamily';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../../navigation/navigationStrings';

const {width, height} = Dimensions.get('window');

const ShowSpaceCompo = ({data, index, onPress}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        {
          marginLeft: index === 0 ? 20 : 0,
          backgroundColor: data?.bg,
        },
      ]}>
      <View
        style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: data?.shadow,
          position: 'absolute',
          left: 0,
          top: 40,
        }}
      />
      <Image source={data?.img} style={styles.logo} />
      <View style={{paddingHorizontal: 20, marginTop: 30, marginBottom: 20}}>
        <Text numberOfLines={1} style={styles.label}>
          {data?.title}
        </Text>
        <Text numberOfLines={3} style={styles.desc}>
          {data?.desc}
        </Text>
      </View>
      <TouchableOpacity
        style={[
          styles.iconContainer,
          {
            backgroundColor: data?.dark,
          },
        ]}
        activeOpacity={0.8}>
        <Image
          source={require('../../assets/ArrowIcon.png')}
          style={styles.icon}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width / 2 - 10,
    marginRight: 14,
    borderRadius: 10,
    marginTop: 40,
    marginBottom: 23,
  },
  label: {
    fontSize: 20,
    color: colors.black,
    fontFamily: fontFamily.rubik_semi_bold,
    marginBottom: 16,
  },
  desc: {
    fontSize: 12,
    color: colors.lightBlack,
    fontFamily: fontFamily.rubik_medium,
  },
  logo: {
    width: 160,
    height: 160,
    marginLeft: -10,
    marginTop: -40,
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: colors.white,
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
    alignSelf: 'center',
    marginBottom: -23,
  },
});

export default ShowSpaceCompo;
