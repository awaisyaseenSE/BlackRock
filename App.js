import 'react-native-gesture-handler';
import {View, Text, SafeAreaView} from 'react-native';
import React, {useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import LoginScreen from './app/screens/LoginScreen';
import SignUpScreen from './app/screens/SignUpScreen';

export default function App() {
  return (
    <>
      {/* <SignUpScreen /> */}
      <LoginScreen />
    </>
  );
}
