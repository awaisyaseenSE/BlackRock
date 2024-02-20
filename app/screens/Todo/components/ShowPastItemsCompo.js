import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import React from 'react';
import colors from '../../../styles/colors';
import fontFamily from '../../../styles/fontFamily';

const ShowPastItemsCompo = ({pastTodoItems}) => {
  const handleCheckboxToggle = async item => {
    // Toggle the 'done' property
    console.log('before: ', item.done);
    item.done = !JSON.parse(item.done);
    console.log('after ', item.done);

    // Update AsyncStorage with the modified todo item
    // await AsyncStorage.setItem("todoItems", JSON.stringify(pastTodoItems));

    // // Update the UI by calling the parent component's function
    // updateTodoItem(pastTodoItems);
  };

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

  const renderItem = ({item, index}) => {
    const formattedDate = formatDate(item?.date);
    console.log(item.done);
    // console.log(item?.done !== undefined && JSON.parse(item?.done));
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor:
              item?.priority == 'high'
                ? colors.todoRed
                : item?.priority == 'low'
                ? colors.todoGreen
                : colors.todoYellow,
          },
        ]}>
        <Text style={styles.heading}>{item?.text}</Text>
        <Text style={styles.dateText}>{formattedDate}</Text>
      </View>
    );
  };

  return (
    <>
      <FlatList
        data={pastTodoItems}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={<View style={{marginVertical: 8}} />}
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

export default ShowPastItemsCompo;
