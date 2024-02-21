import {View, StyleSheet, StatusBar} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import colors from '../../../styles/colors';

export default function TodoSplashScreen() {
  return (
    <>
      <StatusBar hidden backgroundColor={colors.white} />
      <LinearGradient
        style={{flex: 1}}
        start={{x: 0.5, y: 0}}
        end={{x: 0.8, y: 1}}
        colors={['#D4CCFF', '#F4B8DA', '#F9DDDC']}>
        <View style={styles.container}>
          <LottieView
            style={styles.logo}
            source={require('../../../assets/animation/todo-animation1.json')}
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
    width: 120,
    height: 120,
  },
});
