import {View, Text, Image, StyleSheet} from 'react-native';
import React from 'react';
import colors from '../../../styles/colors';

const FoodTopHomeCompo = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/food/man.png')}
        style={styles.leftIcon}
      />
      <Image
        source={require('../../../assets/food/notification.png')}
        style={styles.rightIcon}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  leftIcon: {
    width: 40,
    height: 40,
  },
  rightIcon: {
    width: 26,
    height: 26,
    tintColor: colors.lightBlack,
  },
});

export default FoodTopHomeCompo;
