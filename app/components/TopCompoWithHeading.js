import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
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
  style,
  titleStyle,
  backIconStyle,
  rightIconContainerStyle,
  loading = false,
}) => {
  return (
    <View style={{...styles.container, ...style}}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity
          style={{
            paddingHorizontal: 10,
            paddingVertical: 6,
          }}
          onPress={onPress}>
          <Image
            source={require('../assets/back.png')}
            style={{...styles.backIcon, ...backIconStyle}}
          />
        </TouchableOpacity>
        <Text style={{...styles.text, ...titleStyle}}>{title}</Text>
      </View>
      {rightIcon !== '' && (
        <TouchableOpacity
          style={[styles.rightIconContainer, rightIconContainerStyle]}
          onPress={onPressRight}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator size={'small'} color={colors.white} />
          ) : (
            <Image
              source={rightIcon}
              style={[styles.backIcon, rightIconStyle]}
            />
          )}
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
    tintColor: colors.white,
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
    color: colors.white,
  },
  righttext: {
    fontSize: 14,
    fontFamily: fontFamily.rubik_medium,
    color: colors.blue,
  },
  rightIconContainer: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
});

export default TopCompoWithHeading;
