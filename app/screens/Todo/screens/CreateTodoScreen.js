import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenComponent from '../../../components/ScreenComponent';
import colors from '../../../styles/colors';
import TopCompoWithHeading from '../../../components/TopCompoWithHeading';
import {useNavigation} from '@react-navigation/native';
import TextInputCompo from '../../../components/TextInputCompo';
import DatePicker from 'react-native-date-picker';
import {
  getFontSize,
  getResponsiveHeight,
  getResponsiveMargin,
} from '../../../utils/getResponsiveMarginPadding';
import fontFamily from '../../../styles/fontFamily';
import PriorityModalCompo from '../components/PriorityModalCompo';
import ButtonComponent from '../../../components/ButtonComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreateTodoScreen() {
  const navigation = useNavigation();
  const [todoText, setTodoText] = useState('');
  const [openDateModal, setOpenDateModal] = useState(false);
  const [todoDate, setTodoDate] = useState('');
  const [todoPriority, setTodoPriority] = useState('');
  const [showPriorityModal, setShowPriorityModal] = useState(false);
  const [todoTextError, setTodoTextError] = useState('');
  const [todoDateError, setTodoDateError] = useState('');
  const [todoPriorityError, setTodoPriorityError] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleOpenDateModal = () => {
    setOpenDateModal(!openDateModal);
  };

  // const storeTodoItem = async todoItem => {
  //   try {
  //     setLoading(true);
  //     const existingTodoItems = await AsyncStorage.getItem('todoItems');
  //     console.log('existingTodoItems is: ', existingTodoItems);
  //     let updatedTodoItems = [];
  //     if (existingTodoItems !== null) {
  //       updatedTodoItems = JSON.parse(existingTodoItems);
  //     }
  //     updatedTodoItems.push(todoItem);
  //     await AsyncStorage.setItem('todoItems', JSON.stringify(updatedTodoItems));
  //     setLoading(false);
  //   } catch (error) {
  //     setLoading(false);
  //     console.error('Error saving todo item: ', error);
  //   }
  // };

  const storeTodoItem = async todoItem => {
    try {
      setLoading(true);
      const existingTodoItems = await AsyncStorage.getItem('todoItems');
      let updatedTodoItems = [];
      if (existingTodoItems !== null) {
        updatedTodoItems = JSON.parse(existingTodoItems);
      }
      // Assign default position based on the length of existing todo items
      const defaultPosition = updatedTodoItems.length;
      // Add the todo item with the default position
      const todoItemWithPosition = {...todoItem, position: defaultPosition};
      updatedTodoItems.push(todoItemWithPosition);
      await AsyncStorage.setItem('todoItems', JSON.stringify(updatedTodoItems));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error saving todo item: ', error);
    }
  };

  const handleAddTodo = async () => {
    if (todoText.trim().length < 1) {
      setTodoTextError('Item is empty!');
    } else {
      setTodoTextError('');
    }
    if (todoDate == '' || todoDate == null) {
      setTodoDateError('Date is required!');
    } else {
      setTodoDateError('');
    }
    if (todoPriority == '') {
      setTodoPriorityError('Select priority of item!');
    } else {
      setTodoPriorityError('');
    }

    if (todoText.length > 0 && todoDate !== '' && todoPriority !== '') {
      try {
        let id = Date.now().toString();
        const todoItem = {
          id: id,
          text: todoText,
          date: todoDate.toDateString(),
          priority: todoPriority,
          done: JSON.stringify(false),
        };
        await storeTodoItem(todoItem);
        // Alert.alert('Item is added successfully!');
        setTodoText('');
        setTodoDate('');
        setTodoPriority('');
        navigation.goBack();
      } catch (error) {
        setLoading(false);
        console.log('Error in handleAddTodo(): ', error);
      }
    }
  };

  return (
    <>
      <ScreenComponent style={{backgroundColor: colors.todoPink}}>
        <TopCompoWithHeading
          style={styles.topCompoStyle}
          backIconStyle={styles.backICon}
          onPress={() => navigation.goBack()}
        />
        <StatusBar
          backgroundColor={colors.black}
          barStyle={
            Platform.OS === 'android' ? 'light-content' : 'dark-content'
          }
        />
        <KeyboardAvoidingView
          style={{
            flex: 1,
            width: '100%',
          }}
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          enabled
          keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}>
          <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
              <TextInputCompo
                value={todoText}
                // onChangeText={text => setTodoText(text)}
                onChangeText={text => {
                  if (text.trim().length) {
                    setTodoText(text);
                  } else {
                    setTodoText('');
                  }
                }}
                placeholder="Add Item"
                inputStyle={styles.inputStyle}
                textStyle={{color: colors.todoBlue}}
                clearIcon={todoText.length > 0 ? 'Clear' : ''}
                onPressClear={() => setTodoText('')}
              />
              {todoTextError.length > 0 ? (
                <Text style={styles.errorTxt}>{todoTextError}</Text>
              ) : (
                <View style={{marginVertical: 8}} />
              )}
              <TouchableOpacity
                style={styles.datePickerContainer}
                onPress={toggleOpenDateModal}>
                <TextInput
                  editable={false}
                  value={todoDate !== '' ? todoDate.toDateString() : todoDate}
                  style={styles.inputDate}
                  placeholder="Select date"
                  placeholderTextColor={colors.grey}
                />
                <TouchableOpacity onPress={toggleOpenDateModal}>
                  <Image
                    source={require('../../../assets/ic_datepicker.png')}
                    style={[
                      styles.datePickerIcon,
                      {tintColor: colors.todoBlue},
                    ]}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
              {todoDateError.length > 0 ? (
                <Text style={styles.errorTxt}>{todoDateError}</Text>
              ) : (
                <View style={{marginVertical: 8}} />
              )}
              <DatePicker
                modal
                mode="date"
                open={openDateModal}
                date={new Date()}
                maximumDate={new Date('2030-12-10')}
                // minimumDate={new Date()}
                minimumDate={new Date('2001-12-10')}
                onConfirm={date => {
                  setTodoDate(date);
                  setOpenDateModal(false);
                }}
                onCancel={() => setOpenDateModal(false)}
              />
              <TouchableOpacity
                style={styles.datePickerContainer}
                onPress={() => setShowPriorityModal(true)}>
                <TextInput
                  editable={false}
                  value={todoPriority.toUpperCase()}
                  style={styles.inputDate}
                  placeholder="Priority"
                  placeholderTextColor={colors.grey}
                />
                <TouchableOpacity onPress={() => setShowPriorityModal(true)}>
                  <Image
                    source={require('../../../assets/prioritize.png')}
                    style={styles.datePickerIcon}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
              {todoPriorityError.length > 0 ? (
                <Text style={styles.errorTxt}>{todoPriorityError}</Text>
              ) : (
                <View style={{marginVertical: 8}} />
              )}
              {showPriorityModal && (
                <PriorityModalCompo
                  setTodoPriority={setTodoPriority}
                  setShowPriorityModal={setShowPriorityModal}
                  showPriorityModal={showPriorityModal}
                />
              )}
              <ButtonComponent
                style={styles.addBtn}
                title="Add todo"
                onPress={handleAddTodo}
                loading={loading}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ScreenComponent>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
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
  inputStyle: {
    backgroundColor: colors.todoWhite,
    shadowColor: colors.lightBlack,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    marginBottom: 0,
  },
  datePickerIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  datePickerContainer: {
    backgroundColor: colors.todoWhite,
    height: getResponsiveHeight(6),
    borderRadius: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    shadowColor: colors.lightBlack,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    // marginBottom: getResponsiveMargin(14),
  },
  inputDate: {
    flex: 1,
    fontSize: getFontSize(14),
    fontFamily: fontFamily.rubik_medium,
    color: colors.todoBlue,
  },
  addBtn: {
    borderRadius: 12,
    marginTop: '8%',
    backgroundColor: colors.todoBlue,
    shadowColor: colors.lightBlack,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  errorTxt: {
    color: colors.todoRed,
    fontSize: 12,
    fontFamily: fontFamily.rubik_medium,
    paddingHorizontal: 8,
    marginVertical: 8,
  },
});
