import {View, StyleSheet, StatusBar} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';

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
          <LottieView
            style={styles.logo}
            source={require('../assets/animation/heart-animation.json')}
            loop={false}
            autoPlay
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
    width: 130,
    height: 130,
  },
});
