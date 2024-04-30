import {View, Text, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import React, {useState, useEffect} from 'react';
import ScreenComponent from '../../components/ScreenComponent';
import colors from '../../styles/colors';

export default function WorkoutListScreen({route}) {
  const name = route?.params?.name;
  return (
    <>
      <ScreenComponent
        style={{backgroundColor: colors.LightWhite}}
        content={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}>
        <View style={styles.container}>
          <Text>WorkoutListScreen</Text>
        </View>
      </ScreenComponent>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
