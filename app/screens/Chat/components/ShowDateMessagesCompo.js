import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import colors from '../../../styles/colors';
import moment from 'moment';
import fontFamily from '../../../styles/fontFamily';

const ShowDateMessagesCompo = ({date}) => {
  var dateOfMsg = moment(date).month(moment(date).month()).format('ddd, DD/MM');

  const today = new Date();
  if (today.toDateString() === date.toDateString()) {
    dateOfMsg = 'Today';
  }
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (yesterday.toDateString() === date.toDateString()) {
    dateOfMsg = 'Yesterday';
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <View
        style={{
          height: 2,
          backgroundColor: colors.lineColor,
          flex: 1,
        }}
      />
      <Text style={styles.messageDateStyle}>{dateOfMsg}</Text>
      <View
        style={{
          height: 2,
          backgroundColor: colors.lineColor,
          flex: 1,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  messageDateStyle: {
    textAlign: 'center',
    marginVertical: 10,
    marginHorizontal: 12,
    fontFamily: fontFamily.rubik_medium,
    color: colors.gray,
    fontSize: 14,
  },
});

export default ShowDateMessagesCompo;
