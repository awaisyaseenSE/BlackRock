import {
  StyleSheet,
  SafeAreaView,
  Platform,
  View,
  StatusBar,
} from 'react-native';
import React from 'react';

export default function ScreenComponent({
  style,
  children,
  backgroundColor = 'black',
  content = 'light-content',
}) {
  return (
    <>
      <StatusBar barStyle={content} backgroundColor={backgroundColor} />
      {Platform.OS === 'ios' ? (
        <SafeAreaView style={[styles.screen, style]}>{children}</SafeAreaView>
      ) : (
        <View style={[styles.screen, style]}>{children}</View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingVertical: Platform.OS === 'android' ? 5 : 0,
  },
});
