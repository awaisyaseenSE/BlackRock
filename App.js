import 'react-native-gesture-handler';
import {View} from 'react-native';
import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import MainNavigator from './app/navigation/MainNavigator';
import SplashScreen from './app/screens/SplashScreen';

export default function App() {
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setSplashDone(true);
    }, 2000);
  }, []);

  return <>{splashDone ? <MainNavigator /> : <SplashScreen />}</>;
}
