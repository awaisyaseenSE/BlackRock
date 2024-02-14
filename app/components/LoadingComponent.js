import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import colors from '../styles/colors';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';

const LoadingComponent = ({laoding}) => {
  return (
    <LinearGradient
      style={{flex: 1}}
      start={{x: 1, y: 0}}
      end={{x: 0, y: 1}}
      colors={['#313131', '#262626', '#131313']}>
      <View style={styles.container}>
        <LottieView
          style={styles.laodingStyle}
          source={require('../assets/animation/loading-animation.json')}
          loop
          autoPlay
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // opacity: 0.6,
  },
  laodingStyle: {
    width: 140,
    height: 140,
  },
});

export default LoadingComponent;
