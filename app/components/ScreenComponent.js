import {StyleSheet, SafeAreaView, Platform, View} from 'react-native';
import React from 'react';

export default function ScreenComponent({style, children}) {
  return Platform.OS === 'ios' ? (
    <SafeAreaView style={[styles.screen, style]}>{children}</SafeAreaView>
  ) : (
    <View style={[styles.screen, style]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    marginVertical: Platform.OS === 'android' ? 5 : 0,
  },
});
