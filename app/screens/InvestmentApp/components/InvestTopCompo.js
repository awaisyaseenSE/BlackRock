import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import fontFamily from '../../../styles/fontFamily';
import colors from '../../../styles/colors';
import {useNavigation} from '@react-navigation/native';

const InvestTopCompo = ({
  leftIcon,
  onPress,
  rightIcon,
  title = '',
  rightOnPress,
}) => {
  const navigation = useNavigation();
  if (!onPress) {
    onPress = () => navigation.goBack();
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.6}
        style={styles.leftIconContainer}>
        <Image
          source={leftIcon ? leftIcon : require('../../../assets/backward.png')}
          style={styles.leftIconStyle}
        />
      </TouchableOpacity>
      <Text style={styles.heading}>{title}</Text>
      {!rightIcon ? (
        <View style={{width: '12%'}} />
      ) : (
        <TouchableOpacity
          style={styles.rightIconContainer}
          onPress={rightOnPress}>
          <Image source={rightIcon} style={styles.leftIconStyle} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftIconStyle: {
    width: 20,
    height: 20,
  },
  leftIconContainer: {
    width: '12%',
    paddingVertical: 6,
  },
  heading: {
    fontSize: 16,
    color: colors.black,
    fontFamily: fontFamily.rubik_medium,
  },
  rightIconContainer: {
    width: '12%',
    paddingVertical: 6,
    alignItems: 'flex-end',
  },
});

export default InvestTopCompo;
