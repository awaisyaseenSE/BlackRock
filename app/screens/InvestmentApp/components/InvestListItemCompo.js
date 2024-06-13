import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import fontFamily from '../../../styles/fontFamily';
import colors from '../../../styles/colors';

const InvestListItemCompo = ({title = '', icon}) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Image source={icon} style={styles.icon} />
        <Text style={styles.heading}>{title}</Text>
      </View>
      <Image
        source={require('../../../assets/forward.png')}
        style={styles.icon1}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 6,
    shadowColor: colors.gray,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    marginBottom: 20,
  },
  heading: {
    fontSize: 18,
    fontFamily: fontFamily.lato_bold,
    color: colors.black,
    marginLeft: 30,
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: 'black',
    resizeMode: 'contain',
  },
  icon1: {
    width: 16,
    height: 16,
    tintColor: 'black',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default InvestListItemCompo;
