import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenComponent from '../../../components/ScreenComponent';
import colors from '../../../styles/colors';
import fontFamily from '../../../styles/fontFamily';
import AsynStorage from '@react-native-async-storage/async-storage';
import TodoHeaderCompo from '../components/TodoHeaderCompo';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../../../navigation/navigationStrings';

export default function TodoScreen() {
  const navigation = useNavigation();
  return (
    <>
      <ScreenComponent style={{backgroundColor: colors.todoPink}}>
        <TodoHeaderCompo
          onPress={() =>
            navigation.navigate(navigationStrings.CREATE_TODO_SCREEN)
          }
        />
        <View style={styles.container}>
          <Text>Todo Screen data are show here</Text>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerTxtContainer}>
            <Text style={styles.footerTxt}>Today</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.footerTxtContainer,
              {borderLeftWidth: 1, borderRightWidth: 1},
            ]}>
            <Text style={styles.footerTxt}>Later</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerTxtContainer}>
            <Text style={styles.footerTxt}>History</Text>
          </TouchableOpacity>
        </View>
      </ScreenComponent>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    height: 50,
  },
  footerTxtContainer: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderColor: colors.todoBlue,
    borderBottomWidth: 1,
  },
  footerTxt: {
    fontSize: 16,
    fontFamily: fontFamily.rubik_semi_bold,
    color: colors.black,
  },
});
