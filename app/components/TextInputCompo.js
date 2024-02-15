import React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import {
  getFontSize,
  getResponsiveHeight,
  getResponsiveMargin,
} from '../utils/getResponsiveMarginPadding';

function TextInputCompo({
  value = '',
  onChangeText,
  placeholder = '',
  secureTextEntry = false,
  onPressSecure = () => {},
  secureText = '',
  inputStyle = {},
  textStyle = {},
  placeholderTextColor = colors.grey,
  clearIcon = '',
  onPressClear = () => {},
  ...props
}) {
  return (
    <View style={{...styles.inputStyle, ...inputStyle}}>
      <TextInput
        style={{...styles.textStyle, ...textStyle}}
        value={value}
        placeholder={placeholder}
        onChangeText={onChangeText}
        placeholderTextColor={placeholderTextColor}
        secureTextEntry={secureTextEntry}
        onPressSecure={onPressSecure}
        {...props}
      />
      {!!secureText ? (
        <TouchableOpacity onPress={onPressSecure}>
          <Image source={secureText} style={styles.showHideIcon} />
        </TouchableOpacity>
      ) : null}
      {clearIcon.length > 0 ? (
        <TouchableOpacity onPress={onPressClear} style={{paddingVertical: 6}}>
          <Image
            source={require('../assets/close.png')}
            style={styles.closeIcon}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  inputStyle: {
    height: getResponsiveHeight(6),
    justifyContent: 'space-between',
    borderRadius: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: getResponsiveMargin(14),
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.borderColor,
  },
  textStyle: {
    fontSize: getFontSize(14),
    fontFamily: fontFamily.rubik_medium,
    flex: 1,
    color: colors.LightWhite,
    marginRight: 12,
  },
  showHideIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: colors.lightGrey,
  },
  closeIcon: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
    tintColor: colors.lightGrey,
  },
});

export default TextInputCompo;
