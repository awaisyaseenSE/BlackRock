import 'react-native-gesture-handler';
import {View, Text, SafeAreaView} from 'react-native';
import React from 'react';
import auth from '@react-native-firebase/auth';

export default function App() {
  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <View style={{flex: 1, backgroundColor: 'beige'}}>
          <Text>App is here ...</Text>
        </View>
      </SafeAreaView>
    </>
  );
}
