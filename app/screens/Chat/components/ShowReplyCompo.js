import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import fontFamily from '../../../styles/fontFamily';
import colors from '../../../styles/colors';
import auth from '@react-native-firebase/auth';

const ShowReplyCompo = ({
  replyText,
  replyUserUid,
  closeReply,
  replyMessageType,
  receiverName,
}) => {
  const currentUserUid = auth()?.currentUser?.uid;
  return (
    <>
      <View style={[styles.replyContainer, {borderTopColor: colors.gray}]}>
        <View style={styles.replyTopContainer}>
          <Text style={[styles.replyTextHeading, {color: colors.red}]}>
            {replyUserUid === currentUserUid
              ? 'Replying to yourself'
              : 'Replying to ' + receiverName}
          </Text>
          <TouchableOpacity
            style={styles.closeReplyIconContainer}
            onPress={closeReply}>
            <Image
              source={require('../../../assets/close.png')}
              style={[styles.closeReplyIcon, {tintColor: colors.white}]}
            />
          </TouchableOpacity>
        </View>
        {replyMessageType === 'text' ? (
          <Text style={[styles.replyTextStyle, {color: colors.gray}]}>
            {replyText}
          </Text>
        ) : null}
        {replyMessageType === 'image' ? (
          <View style={styles.replyImageContainer}>
            <Image
              source={require('../../../assets/ic_image.png')}
              style={[styles.replyImageIcon, {tintColor: colors.lightOffWhite}]}
            />
            <Text
              style={[
                styles.replyTextStyle,
                {marginLeft: 6, color: colors.gray},
              ]}>
              Photo
            </Text>
          </View>
        ) : null}
        {replyMessageType === 'audio' ? (
          <View style={styles.replyImageContainer}>
            <Image
              source={require('../../../assets/mic.png')}
              style={[styles.replyImageIcon, {tintColor: colors.white}]}
            />
            <Text
              style={[
                styles.replyTextStyle,
                {marginLeft: 6, color: colors.white},
              ]}>
              Voice
            </Text>
          </View>
        ) : null}
        {replyMessageType === 'file' ? (
          <View style={styles.replyImageContainer}>
            <Image
              source={require('../../../assets/ic_document.png')}
              style={[styles.replyImageIcon, {tintColor: colors.white}]}
            />
            <Text
              style={[
                styles.replyTextStyle,
                {marginLeft: 6, color: colors.white},
              ]}>
              Document
            </Text>
          </View>
        ) : null}
        {replyMessageType === 'video' ? (
          <View style={styles.replyImageContainer}>
            <Image
              source={require('../../../assets/video_button.png')}
              style={[styles.replyImageIcon, {tintColor: colors.white}]}
            />
            <Text
              style={[
                styles.replyTextStyle,
                {marginLeft: 6, color: colors.white},
              ]}>
              Video
            </Text>
          </View>
        ) : null}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  replyContainer: {
    paddingBottom: 10,
    width: '100%',
    paddingHorizontal: 14,
    paddingTop: 4,
    borderTopWidth: 1,
  },
  closeReplyIcon: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
  },
  closeReplyIconContainer: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  replyTopContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  replyImageIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    tintColor: colors.gray,
  },
  replyTextStyle: {
    fontSize: 12,
    color: colors.gray,
  },
  replyImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyTextHeading: {
    fontSize: 12,
  },
});

export default ShowReplyCompo;
