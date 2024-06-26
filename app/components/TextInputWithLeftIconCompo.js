import React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import {
  getFontSize,
  getResponsiveHeight,
  getResponsiveMargin,
} from '../utils/getResponsiveMarginPadding';

const TextInputWithLeftIconCompo = ({
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
  closeIconStyle,
  leftIconStyle,
  onPress,
  loading = false,
  ...props
}) => {
  return (
    <View style={{...styles.inputStyle, ...inputStyle}}>
      <TouchableOpacity
        style={{
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={onPress}
        activeOpacity={0.6}>
        <Image
          source={require('../assets/tab_search.png')}
          style={{...styles.leftIcon, ...leftIconStyle}}
        />
      </TouchableOpacity>
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
        <TouchableOpacity
          onPress={onPressClear}
          style={{
            paddingVertical: 6,
            // backgroundColor: 'pink',
            paddingHorizontal: 4,
          }}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator size={'small'} color={colors.LightWhite} />
          ) : (
            <Image
              source={require('../assets/close.png')}
              style={{...styles.closeIcon, ...closeIconStyle}}
            />
          )}
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

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
    height: '100%',
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
  leftIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    tintColor: colors.gray,
    marginRight: 12,
  },
});

export default TextInputWithLeftIconCompo;
