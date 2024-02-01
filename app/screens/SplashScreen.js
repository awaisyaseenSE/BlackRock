import {View, Text, StyleSheet, StatusBar, Image} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

export default function SplashScreen() {
  return (
    <>
      <StatusBar hidden />
      <LinearGradient
        style={{flex: 1}}
        start={{x: 1, y: 0}}
        end={{x: 0, y: 1}}
        colors={['#F5F5F5', '#E3F7FF', '#E5ECFA']}>
        <View style={styles.container}>
          <Image
            source={require('../assets/dragon-logo.png')}
            style={styles.logo}
          />
        </View>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
  },
});
