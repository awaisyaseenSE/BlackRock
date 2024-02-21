import {View, StyleSheet, TouchableOpacity, Text, Platform} from 'react-native';
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
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {StatusBar} from 'react-native';
import TodoButtomTabCompo from '../components/TodoButtomTabCompo';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export default function TodoScreen() {
  const navigation = useNavigation();
  const [todoItems, setTodoItems] = useState([]);
  const isFocused = useIsFocused();
  const [todayTodoItems, setTodayTodoItems] = useState([]);
  const [futureTodoItems, setFutureTodoItems] = useState([]);
  const [pastTodoItems, setPastTodoItems] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (isFocused) {
      getTodoItems();
    }
  }, [isFocused]);

  //   const separateTodoItems = alltodoItems => {
  //     const currentDate = new Date();

  //     const todayItems = alltodoItems.filter(item => {
  //       const itemDate = new Date(item.date);
  //       return isSameDay(currentDate, itemDate);
  //     });

  //     const futureItems = alltodoItems.filter(item => {
  //       const itemDate = new Date(item.date);
  //       return itemDate > currentDate;
  //     });

  //     const historyItems = alltodoItems.filter(item => {
  //       const today = new Date();
  //       today.setHours(0, 0, 0, 0);
  //       const itemDate = new Date(item.date);
  //       return itemDate < today;
  //     });
  //     let allToday = todayItems;
  //     console.log('today items: ', allToday.length);
  //     // console.log('today items: ', allToday);
  //     setTodayTodoItems(allToday);

  //     let allFuture = futureItems;
  //     setFutureTodoItems(allFuture);
  //     console.log('future items: ', allFuture.length);
  //     // console.log('future items: ', allFuture);

  //     let allHistory = historyItems;
  //     setPastTodoItems(allHistory);
  //     console.log('History items: ', allHistory.length);
  //     // console.log('History items: ', allHistory);
  //   };

  const separateTodoItems = alltodoItems => {
    const currentDate = new Date();

    const todayItems = alltodoItems.filter(item => {
      if (!JSON.parse(item.done)) {
        const itemDate = new Date(item.date);
        return isSameDay(currentDate, itemDate);
      }
    });

    const futureItems = alltodoItems.filter(item => {
      if (!JSON.parse(item.done)) {
        const itemDate = new Date(item.date);
        return itemDate > currentDate;
      }
    });

    const historyItems = alltodoItems.filter(item => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const itemDate = new Date(item.date);
      return itemDate < today || JSON.parse(item.done);
    });
    let allToday = todayItems;
    // console.log('today items: ', allToday.length);
    // console.log('today items: ', allToday);
    allToday.sort((a, b) => a.position - b.position); // new line added to sort items of todo based on position
    setTodayTodoItems(allToday);

    let allFuture = futureItems;
    setFutureTodoItems(allFuture);
    // console.log('future items: ', allFuture.length);
    // console.log('future items: ', allFuture);

    let allHistory = historyItems;
    setPastTodoItems(allHistory);
    // console.log('History items: ', allHistory.length);
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
        // console.log('Total Todo Items length is: ', parsedTodoItems.length);
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
      <GestureHandlerRootView style={{flex: 1}}>
        <View
          style={{
            backgroundColor: colors.todoPink,
            flex: 1,
            paddingTop: Platform.OS == 'ios' ? insets.top : 10,
          }}>
          <StatusBar
            backgroundColor={colors.black}
            barStyle={
              Platform.OS === 'android' ? 'light-content' : 'dark-content'
            }
          />
          <TodoHeaderCompo
            onPress={() =>
              navigation.navigate(navigationStrings.CREATE_TODO_SCREEN)
            }
          />
          <View style={styles.container}>
            {selectedTab === 0 ? (
              <ShowTodayItemsCompo
                todayTodoItems={todayTodoItems}
                getTodoItems={getTodoItems}
                setTodayTodoItems={setTodayTodoItems}
                futureTodoItems={futureTodoItems}
                pastTodoItems={pastTodoItems}
              />
            ) : selectedTab === 1 ? (
              <ShowFutureItemsCompo
                futureTodoItems={futureTodoItems}
                setFutureTodoItems={setFutureTodoItems}
                pastTodoItems={pastTodoItems}
                todayTodoItems={todayTodoItems}
              />
            ) : selectedTab === 2 ? (
              <ShowPastItemsCompo pastTodoItems={pastTodoItems} />
            ) : null}
          </View>
          <TodoButtomTabCompo
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        </View>
      </GestureHandlerRootView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
