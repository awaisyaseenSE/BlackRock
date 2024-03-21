import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import React from 'react';
import fontFamily from '../../../styles/fontFamily';
import colors from '../../../styles/colors';
import {removeItemValue} from '../../../helper/storeAndGetAsyncStorageValue';

const TodoHeaderCompo = ({onPress}) => {
  const handleClearTodoItems = async () => {
    try {
      let key = 'todoItems';
      await removeItemValue(key);
      // navigation.navigate('MainTabRoutes');
    } catch (error) {
      console.log('Error in deleting all todo items in ToHeaderCompo: ', error);
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <Text style={styles.text}>Todo List</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onPress}>
        <Image
          source={require('../../../assets/add-todo.png')}
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // marginBottom: 12,
    marginTop: Platform.OS === 'android' ? 6 : 0,
  },
  text: {
    fontSize: 20,
    fontFamily: fontFamily.rubik_bold,
    color: colors.todoBlue,
  },
  icon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
    tintColor: colors.todoBlue,
  },
});

export default TodoHeaderCompo;
