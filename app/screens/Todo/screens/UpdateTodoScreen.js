import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import React, {useState} from 'react';
import ScreenComponent from '../../../components/ScreenComponent';
import colors from '../../../styles/colors';
import TopCompoWithHeading from '../../../components/TopCompoWithHeading';
import {useNavigation} from '@react-navigation/native';
import TextInputCompo from '../../../components/TextInputCompo';
import DatePicker from 'react-native-date-picker';
import {
  getFontSize,
  getResponsiveHeight,
} from '../../../utils/getResponsiveMarginPadding';
import fontFamily from '../../../styles/fontFamily';
import PriorityModalCompo from '../components/PriorityModalCompo';
import ButtonComponent from '../../../components/ButtonComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyIndicator from '../../../components/MyIndicator';

export default function UpdateTodoScreen({route}) {
  const navigation = useNavigation();
  const todoItemData = route?.params?.data;
  const [todoText, setTodoText] = useState(todoItemData?.text || '');
  const [openDateModal, setOpenDateModal] = useState(false);
  const [todoDate, setTodoDate] = useState(todoItemData?.date || '');
  const [todoPriority, setTodoPriority] = useState(
    todoItemData?.priority || '',
  );
  const [showPriorityModal, setShowPriorityModal] = useState(false);
  const [todoTextError, setTodoTextError] = useState('');
  const [todoDateError, setTodoDateError] = useState('');
  const [todoPriorityError, setTodoPriorityError] = useState('');
  const [loading, setLoading] = useState(false);
  const [itemStatus, setItemStatus] = useState(JSON.parse(todoItemData?.done));
  const [deleteloading, setDeleteLoading] = useState(false);

  const handleDataSetting = () => {
    const myNewDate = new Date(todoDate);
    console.log('newdate: ', myNewDate);
    let day = myNewDate.getDate();
    let fullYear = myNewDate.getFullYear();
    let month = myNewDate.getMonth() + 1;
    let finalDate = `${fullYear}-${month}-${day}`;
    // return finalDate;
    let correctTodayDate = new Date();
    // console.log(correctTodayDate);

    let checkTodayDate = new Date(finalDate);
    console.log('correctTodayDate:  ', correctTodayDate);
    console.log('checkTodayDate:  ', checkTodayDate);
  };

  const toggleOpenDateModal = () => {
    setOpenDateModal(!openDateModal);
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
        setLoading(true);

        const existingTodoItems = await AsyncStorage.getItem('todoItems');
        let updatedTodoItems = JSON.parse(existingTodoItems) || [];

        const indexToUpdate = updatedTodoItems.findIndex(
          item => item.id === todoItemData.id,
        );

        if (indexToUpdate !== -1) {
          updatedTodoItems[indexToUpdate] = {
            ...updatedTodoItems[indexToUpdate],
            text: todoText,
            date: todoDate,
            priority: todoPriority,
            done: JSON.stringify(itemStatus),
          };

          await AsyncStorage.setItem(
            'todoItems',
            JSON.stringify(updatedTodoItems),
          );
          navigation.goBack();
        }

        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log('Error in handleAddTodo(): ', error);
      }
    }
  };

  const handleDeleteTodoItem = async () => {
    let todoItemId = todoItemData.id;
    try {
      setDeleteLoading(true);
      const existingTodoItems = await AsyncStorage.getItem('todoItems');
      let updatedTodoItems = JSON.parse(existingTodoItems) || [];

      // Find here specific item of array based on id
      const indexToUpdate = updatedTodoItems.findIndex(
        item => item.id === todoItemId,
      );

      if (indexToUpdate !== -1) {
        // Delete the item at the found index
        updatedTodoItems.splice(indexToUpdate, 1);

        await AsyncStorage.setItem(
          'todoItems',
          JSON.stringify(updatedTodoItems),
        );
      }
      setDeleteLoading(false);
      navigation.goBack();
    } catch (error) {
      setDeleteLoading(false);
      console.error('Error deleting todo item: ', error);
    }
  };

  return (
    <>
      <ScreenComponent style={{backgroundColor: colors.todoPink}}>
        <TopCompoWithHeading
          style={styles.topCompoStyle}
          backIconStyle={styles.backICon}
          onPress={() => navigation.goBack()}
          rightIcon={require('../../../assets/delete.png')}
          rightIconStyle={{tintColor: colors.todoRed, width: 22, height: 22}}
          onPressRight={() => handleDeleteTodoItem()}
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
                  //   value={todoDate !== '' ? todoDate.toDateString() : todoDate}
                  value={todoDate}
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
                  setTodoDate(date.toDateString());
                  setOpenDateModal(false);
                  //   console.log(date);
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
              <View
                style={{
                  paddingHorizontal: 4,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  style={styles.checkIconContainer}
                  onPress={() => setItemStatus(!itemStatus)}
                  activeOpacity={0.8}>
                  {itemStatus && (
                    <Image
                      source={require('../../../assets/check.png')}
                      style={styles.iconStyle}
                    />
                  )}
                </TouchableOpacity>
                <Text style={styles.subText}>Mark as completed</Text>
              </View>
              <ButtonComponent
                style={styles.addBtn}
                title="Update todo"
                onPress={handleAddTodo}
                loading={loading}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ScreenComponent>
      <MyIndicator
        visible={deleteloading}
        backgroundColor={colors.lightBlackTwo}
      />
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
    marginBottom: 12,
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
  iconStyle: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    tintColor: colors.todoBlue,
  },
  checkIconContainer: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.todoBlue,
    borderRadius: 4,
  },
  subText: {
    fontSize: 14,
    color: colors.todoBlue,
    fontFamily: fontFamily.rubik_semi_bold,
    marginLeft: 12,
  },
});
