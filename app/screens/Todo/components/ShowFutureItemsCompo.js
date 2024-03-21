import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import colors from '../../../styles/colors';
import fontFamily from '../../../styles/fontFamily';
import DraggableFlatList from 'react-native-draggable-flatlist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../../../navigation/navigationStrings';

const ShowFutureItemsCompo = ({
  futureTodoItems,
  setFutureTodoItems,
  pastTodoItems,
  todayTodoItems,
}) => {
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
      <View style={{paddingVertical: 12}}>
        <TouchableOpacity
          activeOpacity={0.8}
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
          ]}>
          <Text style={styles.heading}>{item?.text}</Text>
          <Text style={styles.dateText}>{formattedDate}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <View style={{flex: 1, paddingTop: 12}}>
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
          // dragItemOverflow={true}
          activationDistance={20}
          showsVerticalScrollIndicator={false}
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
});

export default ShowFutureItemsCompo;
