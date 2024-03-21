import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React, {useState} from 'react';
import colors from '../../../styles/colors';
import fontFamily from '../../../styles/fontFamily';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DraggableFlatList from 'react-native-draggable-flatlist';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../../../navigation/navigationStrings';

const ShowTodayItemsCompo = ({
  todayTodoItems,
  getTodoItems,
  setTodayTodoItems,
  futureTodoItems,
  pastTodoItems,
}) => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

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

  const renderItem = ({item, drag, isActive}) => {
    const formattedDate = formatDate(item?.date);
    let itemStatus = JSON.parse(item.done);
    // console.log('position: ', item.position, '  item text is: ', item.text);
    return (
      <View style={{paddingVertical: 12}}>
        <TouchableOpacity
          onLongPress={drag}
          onPress={() =>
            navigation.navigate(navigationStrings.UPDATE_TODO_SCREEN, {
              data: item,
            })
          }
          style={[
            styles.container,
            {
              backgroundColor:
                item?.priority == 'high'
                  ? colors.todoRed
                  : item?.priority == 'low'
                  ? colors.todoGreen
                  : colors.todoYellow,
              opacity: isActive ? 0.8 : 1,
            },
          ]}
          activeOpacity={0.8}>
          <Text style={styles.heading}>{item?.text}</Text>
          <Text style={styles.dateText}>{formattedDate}</Text>
          <View style={{alignItems: 'flex-end'}}>
            <View style={styles.checkBoxContainer}>
              <Text style={styles.subHeading}>Mark as completed</Text>
              <TouchableOpacity
                style={styles.checkBox}
                onPress={() => toggleTodoItemDone(item.id)}>
                {itemStatus && (
                  <Image
                    source={require('../../../assets/check.png')}
                    style={styles.checkBoxIcon}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const handleUpdatePosition = async updatedArr => {
    let temArr = [...updatedArr, ...futureTodoItems, ...pastTodoItems];
    try {
      await AsyncStorage.setItem('todoItems', JSON.stringify(temArr));
    } catch (error) {
      console.error(
        'Error updating todo item with position in show today items: ',
        error,
      );
    }
  };

  return (
    <>
      <View style={{flex: 1, paddingTop: 12}}>
        <DraggableFlatList
          data={todayTodoItems}
          onDragEnd={({data}) => {
            const updatedTodoItems = data.map((item, index) => ({
              ...item,
              position: index,
            }));
            setTodayTodoItems(updatedTodoItems);
            handleUpdatePosition(updatedTodoItems);
          }}
          ListHeaderComponent={() => <View />}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          // dragItemOverflow={true}
          activationDistance={20}
          autoscrollThreshold={50}
          containerStyle={{flex: 1}}
        />
      </View>
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
