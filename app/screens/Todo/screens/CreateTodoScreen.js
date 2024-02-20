import {View, StyleSheet, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenComponent from '../../../components/ScreenComponent';
import colors from '../../../styles/colors';
import TopCompoWithHeading from '../../../components/TopCompoWithHeading';
import {useNavigation} from '@react-navigation/native';

export default function CreateTodoScreen() {
  const navigation = useNavigation();
  return (
    <>
      <ScreenComponent style={{backgroundColor: colors.todoPink}}>
        <TopCompoWithHeading
          style={styles.topCompoStyle}
          backIconStyle={styles.backICon}
          onPress={() => navigation.goBack()}
        />
        <View style={styles.container}>
          <Text>CreateTodoScreen</Text>
        </View>
      </ScreenComponent>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topCompoStyle: {
    paddingVertical: 0,
    marginBottom: 8,
  },
  backICon: {
    width: 22,
    height: 22,
    tintColor: colors.todoBlue,
  },
});
