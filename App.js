import 'react-native-gesture-handler';
import {View, LogBox} from 'react-native';
import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
// import MainNavigator from './app/navigation/MainNavigator';
import SplashScreen from './app/screens/SplashScreen';
import {getValue} from './app/helper/storeAndGetAsyncStorageValue';
import constants from './app/constants/constants';
import OnboardingScreen from './app/screens/OnboardingScreen';
import TodoNavigator from './app/screens/Todo/todoNavigation/TodoNavigator';
import TodoSplashScreen from './app/screens/Todo/screens/TodoSplashScreen';

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  LogBox.ignoreLogs(['ViewPropTypes']);
  useEffect(() => {
    // checkOnBoarding();
    setTimeout(() => {
      setSplashDone(true);
    }, 2000);
  }, []);

  // const checkOnBoarding = async () => {
  //   try {
  //     let key = 'onBoarding';
  //     const val = await getValue(key);
  //     if (val === 'true') {
  //       constants.onBoardingStatus = true;
  //     }
  //   } catch (error) {
  //     console.log('Error in getting onBoarding status in app.js: ', error);
  //   }
  // };

  // return <>{splashDone ? <MainNavigator /> : <SplashScreen />}</>;
  return <>{splashDone ? <TodoNavigator /> : <TodoSplashScreen />}</>;
}
