import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import React from 'react';
import colors from '../../../styles/colors';
import fontFamily from '../../../styles/fontFamily';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../../../navigation/navigationStrings';

const ShowPastItemsCompo = ({pastTodoItems}) => {
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

  const renderItem = ({item, index}) => {
    const formattedDate = formatDate(item?.date);
    let itemDoneStatus = JSON.parse(item.done);
    // console.log(item?.done !== undefined && JSON.parse(item?.done));
    return (
      <TouchableOpacity
        activeOpacity={0.8}
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
          },
        ]}>
        <Text style={styles.heading}>{item?.text}</Text>
        <Text style={styles.dateText}>{formattedDate}</Text>
        {itemDoneStatus && (
          <View style={{alignItems: 'flex-end'}}>
            <View style={styles.checkBoxContainer}>
              <Text style={styles.subHeading}>Task is completed</Text>
              <View style={styles.checkBox}>
                <Image
                  source={require('../../../assets/check.png')}
                  style={styles.checkBoxIcon}
                />
              </View>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <>
      <View style={{flex: 1, paddingTop: 24}}>
        <FlatList
          data={pastTodoItems}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={<View style={{marginVertical: 8}} />}
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

export default ShowPastItemsCompo;
