import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';

const TopHomeComponent = ({leftOnPress, rightOnPress}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconContainer} onPress={leftOnPress}>
        <Image source={require('../assets/menus.png')} style={styles.icon} />
      </TouchableOpacity>
      <Text style={styles.heading}>
        <Text style={{color: colors.yellow}}>M</Text>
        ovies
      </Text>
      <TouchableOpacity style={styles.iconContainer} onPress={rightOnPress}>
        <Image
          source={require('../assets/tab_search.png')}
          style={[styles.icon, {width: 22, height: 22}]}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: colors.white,
  },
  iconContainer: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  heading: {
    fontSize: 20,
    fontFamily: fontFamily.rubik_bold,
    color: colors.LightWhite,
  },
});

export default TopHomeComponent;
