import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import React from 'react';
import colors from '../../../styles/colors';
import fontFamily from '../../../styles/fontFamily';
import DraggableFlatList, {
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ShowFutureItemsCompo = ({
  futureTodoItems,
  setFutureTodoItems,
  pastTodoItems,
  todayTodoItems,
}) => {
  const formatDate = dateString => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-US', {
      // weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    return formattedDate;
  };

  // const renderItem = ({item, index}) => {
  //   const formattedDate = formatDate(item?.date);
  //   return (
  //     <View
  //       style={[
  //         styles.container,
  //         {
  //           backgroundColor:
  //             item?.priority == 'high'
  //               ? colors.todoRed
  //               : item?.priority == 'low'
  //               ? colors.todoGreen
  //               : colors.todoYellow,
  //         },
  //       ]}>
  //       <Text style={styles.heading}>{item?.text}</Text>
  //       <Text style={styles.dateText}>{formattedDate}</Text>
  //     </View>
  //   );
  // };

  const handleUpdatePosition = async updatedArr => {
    let temArr = [...updatedArr, ...todayTodoItems, ...pastTodoItems];
    try {
      await AsyncStorage.setItem('todoItems', JSON.stringify(temArr));
    } catch (error) {
      console.error(
        'Error updating todo item with position in show today items: ',
        error,
      );
    }
  };

  const renderItem = ({item, drag, isActive}) => {
    const formattedDate = formatDate(item?.date);
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onLongPress={drag}
        style={[
          styles.container,
          {
            backgroundColor: isActive
              ? colors.gray
              : item?.priority == 'high'
              ? colors.todoRed
              : item?.priority == 'low'
              ? colors.todoGreen
              : colors.todoYellow,
          },
        ]}>
        <Text style={styles.heading}>{item?.text}</Text>
        <Text style={styles.dateText}>{formattedDate}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      {/* <FlatList
        data={futureTodoItems}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={<View style={{marginVertical: 8}} />}
      /> */}
      <DraggableFlatList
        data={futureTodoItems}
        onDragEnd={({data}) => {
          const updatedTodoItems = data.map((item, index) => ({
            ...item,
            position: index,
          }));
          setFutureTodoItems(updatedTodoItems);
          handleUpdatePosition(updatedTodoItems);
        }}
        ListHeaderComponent={() => <View />}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{marginVertical: 8}} />}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.todoWhite,
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 14,
    fontFamily: fontFamily.rubik_medium,
    color: colors.white,
  },
  dateText: {
    fontSize: 12,
    fontFamily: fontFamily.rubik_regular,
    color: colors.LightWhite,
    marginTop: 6,
  },
});

export default ShowFutureItemsCompo;
