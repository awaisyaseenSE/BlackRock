import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenComponent from '../../../components/ScreenComponent';
import colors from '../../../styles/colors';
import fontFamily from '../../../styles/fontFamily';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TodoHeaderCompo from '../components/TodoHeaderCompo';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import navigationStrings from '../../../navigation/navigationStrings';
import ShowTodayItemsCompo from '../components/ShowTodayItemsCompo';
import ShowPastItemsCompo from '../components/ShowPastItemsCompo';
import ShowFutureItemsCompo from '../components/ShowFutureItemsCompo';

export default function TodoScreen() {
  const navigation = useNavigation();
  const [todoItems, setTodoItems] = useState([]);
  const isFocused = useIsFocused();
  const [todayTodoItems, setTodayTodoItems] = useState([]);
  const [futureTodoItems, setFutureTodoItems] = useState([]);
  const [pastTodoItems, setPastTodoItems] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    if (isFocused) {
      getTodoItems();
    }
  }, [isFocused]);

  const separateTodoItems = alltodoItems => {
    const currentDate = new Date();

    const todayItems = alltodoItems.filter(item => {
      const itemDate = new Date(item.date);
      return isSameDay(currentDate, itemDate);
    });

    const futureItems = alltodoItems.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate > currentDate;
    });

    const historyItems = alltodoItems.filter(item => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const itemDate = new Date(item.date);
      return itemDate < today;
    });
    let allToday = todayItems;
    console.log('today items: ', allToday.length);
    // console.log('today items: ', allToday);
    setTodayTodoItems(allToday);

    let allFuture = futureItems;
    setFutureTodoItems(allFuture);
    console.log('future items: ', allFuture.length);
    // console.log('future items: ', allFuture);

    let allHistory = historyItems;
    setPastTodoItems(allHistory);
    console.log('History items: ', allHistory.length);
    // console.log('History items: ', allHistory);
  };

  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const getTodoItems = async () => {
    try {
      const todoItems = await AsyncStorage.getItem('todoItems');
      if (todoItems !== null) {
        const parsedTodoItems = JSON.parse(todoItems);
        console.log('Total Todo Items length is: ', parsedTodoItems.length);
        // console.log('Todo Items is: ', parsedTodoItems);
        // setTodoItems(parsedTodoItems);
        separateTodoItems(parsedTodoItems);
      }
    } catch (error) {
      console.error('Error loading todo items: ', error);
    }
  };

  return (
    <>
      <ScreenComponent style={{backgroundColor: colors.todoPink}}>
        <TodoHeaderCompo
          onPress={() =>
            navigation.navigate(navigationStrings.CREATE_TODO_SCREEN)
          }
        />
        <View style={styles.container}>
          {selectedTab === 0 ? (
            <ShowTodayItemsCompo todayTodoItems={todayTodoItems} />
          ) : selectedTab === 1 ? (
            <ShowFutureItemsCompo futureTodoItems={futureTodoItems} />
          ) : selectedTab === 2 ? (
            <ShowPastItemsCompo pastTodoItems={pastTodoItems} />
          ) : null}
        </View>
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.footerTxtContainer}
            onPress={() => setSelectedTab(0)}>
            <Text style={styles.footerTxt}>Today</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.footerTxtContainer,
              {borderLeftWidth: 1, borderRightWidth: 1},
            ]}
            onPress={() => setSelectedTab(1)}>
            <Text style={styles.footerTxt}>Future</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footerTxtContainer}
            onPress={() => setSelectedTab(2)}>
            <Text style={styles.footerTxt}>Past</Text>
          </TouchableOpacity>
        </View>
      </ScreenComponent>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
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
