import {View, Text} from 'react-native';
import React from 'react';
import ScreenComponent from '../components/ScreenComponent';

export default function SearchScreen() {
  return (
    <>
      <ScreenComponent style={{backgroundColor: 'beige'}}>
        <View>
          <Text>SearchScreen</Text>
        </View>
      </ScreenComponent>
    </>
  );
}
