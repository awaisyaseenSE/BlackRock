import {View, StyleSheet, StatusBar} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import colors from '../styles/colors';

export default function SplashScreen() {
  return (
    <>
      <StatusBar hidden backgroundColor={'#12212F'} />
      <LinearGradient
        style={{flex: 1}}
        start={{x: 0.5, y: 0}}
        end={{x: 0.5, y: 0}}
        colors={['#12212F', '#1C2A34', '#12212F']}>
        <View style={styles.container}>
          <LottieView
            style={styles.logo}
            source={require('../assets/animation/movie.json')}
            loop={true}
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
    width: 200,
    height: 200,
  },
});
