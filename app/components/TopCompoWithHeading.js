import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';

const TopCompoWithHeading = ({
  title = '',
  onPress,
  rightIcon = '',
  onPressRight,
  rightIconStyle,
  rightTitle = '',
  onPressRightTitle,
}) => {
  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity
          style={{
            paddingHorizontal: 10,
            paddingVertical: 6,
          }}
          onPress={onPress}>
          <Image
            source={require('../assets/back.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.text}>{title}</Text>
      </View>
      {rightIcon !== '' && (
        <TouchableOpacity
          style={{
            paddingHorizontal: 10,
            paddingVertical: 6,
          }}
          onPress={onPressRight}>
          <Image source={rightIcon} style={[styles.backIcon, rightIconStyle]} />
        </TouchableOpacity>
      )}
      {rightTitle !== '' && (
        <TouchableOpacity
          style={{
            paddingHorizontal: 10,
            paddingVertical: 6,
          }}
          onPress={onPressRightTitle}>
          <Text style={[styles.righttext]}>{rightTitle}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  backIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: colors.black,
  },
  container: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontFamily: fontFamily.rubik_medium,
    marginLeft: 12,
    color: colors.black,
  },
  righttext: {
    fontSize: 14,
    fontFamily: fontFamily.rubik_medium,
    color: colors.blue,
  },
});

export default TopCompoWithHeading;
