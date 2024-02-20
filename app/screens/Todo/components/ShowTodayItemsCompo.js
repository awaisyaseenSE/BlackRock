import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import colors from '../../../styles/colors';
import fontFamily from '../../../styles/fontFamily';
import MyIndicator from '../../../components/MyIndicator';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ShowTodayItemsCompo = ({todayTodoItems, getTodoItems}) => {
  const [loading, setLoading] = useState(false);
  // const [status, setStatus] = useState(fa);

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

  const toggleTodoItemDone = async todoItemId => {
    try {
      setLoading(true);
      const existingTodoItems = await AsyncStorage.getItem('todoItems');
      let updatedTodoItems = JSON.parse(existingTodoItems) || [];

      // Find here specific item of array based on id
      const indexToUpdate = updatedTodoItems.findIndex(
        item => item.id === todoItemId,
      );

      if (indexToUpdate !== -1) {
        updatedTodoItems[indexToUpdate].done = JSON.stringify(
          !JSON.parse(updatedTodoItems[indexToUpdate].done),
        );
        await AsyncStorage.setItem(
          'todoItems',
          JSON.stringify(updatedTodoItems),
        );

        getTodoItems();
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error updating todo item: ', error);
    }
  };

  const renderItem = ({item, index}) => {
    const formattedDate = formatDate(item?.date);
    let itemStatus = JSON.parse(item.done);
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
        <View style={{alignItems: 'flex-end'}}>
          <View style={styles.checkBoxContainer}>
            <Text style={styles.subHeading}>Mark as completed</Text>
            <TouchableOpacity
              style={styles.checkBox}
              onPress={() => toggleTodoItemDone(item.id)}>
              {/* {itemStatus && (
              <Image
                source={require('../../../assets/check.png')}
                style={styles.checkBoxIcon}
              />
            )} */}
              {loading ? (
                <ActivityIndicator size={14} color={colors.black} />
              ) : itemStatus ? (
                <Image
                  source={require('../../../assets/check.png')}
                  style={styles.checkBoxIcon}
                />
              ) : null}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      <FlatList
        data={todayTodoItems}
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
  checkBox: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.white,
    paddingHorizontal: 4,
  },
  checkBoxIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    tintColor: colors.white,
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subHeading: {
    fontSize: 12,
    color: colors.LightWhite,
    fontFamily: fontFamily.rubik_medium,
    marginRight: 12,
  },
});

export default ShowTodayItemsCompo;