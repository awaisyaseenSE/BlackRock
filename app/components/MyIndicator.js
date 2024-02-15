import React from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import colors from '../styles/colors';
import LottieView from 'lottie-react-native';

export default function MyIndicator({
  visible,
  style,
  backgroundColor = colors.moviesBg,
}) {
  if (!visible) {
    return null;
  }
  return (
    <View
      style={[
        styles.container,

        {
          opacity: 0.6,
          backgroundColor: backgroundColor,
        },
        style,
      ]}>
      <View style={styles.mainContainer}>
        <LottieView
          style={styles.animationStyle}
          source={require('../assets/animation/movie-loading-animation.json')}
          loop={true}
          autoPlay
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.4,
    height: '100%',
    width: '100%',
    position: 'absolute',
    zIndex: 1,
  },
  mainContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.black,
  },
  animationStyle: {
    width: 60,
    height: 60,
  },
});
