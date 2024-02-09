import React from 'react';
import AsynStorage from '@react-native-async-storage/async-storage';

export const storeValue = async (key, value) => {
  try {
    await AsynStorage.setItem(key, value);
    console.log('value is stored successfully!');
  } catch (error) {
    console.log('Error while storing value in async storage: ', error);
  }
};

export const getValue = async key => {
  try {
    const value = await AsynStorage.getItem(key);
    return value;
  } catch (error) {
    console.log('Error while getting value in async storage: ', error);
  }
};

export const removeItemValue = async key => {
  try {
    await AsynStorage.removeItem(key);
    return true;
  } catch (error) {
    console.log('Error while removing item in async storage: ', error);
    return false;
  }
};
