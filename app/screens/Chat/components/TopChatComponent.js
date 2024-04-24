import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import fontFamily from '../../../styles/fontFamily';
import navigationStrings from '../../../navigation/navigationStrings';
import colors from '../../../styles/colors';

const TopChatComponent = ({userData = null, chatID}) => {
  const navigation = useNavigation();
  return (
    <View style={[styles.container, {borderBottomColor: colors.gray}]}>
      <View style={styles.profileDetailContainer}>
        <TouchableOpacity
          style={styles.backIconContainer}
          onPress={() => navigation.goBack()}>
          <Image
            source={require('../../../assets/back.png')}
            style={[styles.backIcon, {tintColor: colors.lineColor}]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.profileImageContainer}
          onPress={() =>
            // navigation.navigate(navigationStrings.USER_PROFILE, {
            //   userUid: userData?.id,
            // })
            {}
          }>
          <FastImage
            style={styles.profileImageStyle}
            source={{
              uri:
                userData?.imageUrl !== ''
                  ? userData?.imageUrl
                  : 'https://i.pinimg.com/736x/d4/29/1e/d4291ea760fcbf77ef282cb83ab7127b.jpg',
            }}
          />
          <View>
            <Text style={[styles.userNameStyle, {color: colors.lineColor}]}>
              {userData?.fullName}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={[styles.rightIconsContainer, {marginLeft: 12}]}
          onPress={() =>
            // navigation.navigate(navigationStrings.VIDEO_CALL_SCREEN, {
            //   userData: userData,
            //   callID: chatID,
            // })
            {}
          }>
          <Image
            source={require('../../../assets/photos.png')}
            style={[styles.rightIcons]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    borderBottomWidth: 0.2,
    paddingBottom: 12,
    paddingHorizontal: 12,
    backgroundColor: colors.moviesBg,
  },
  backIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  backIconContainer: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  profileImageStyle: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profileDetailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userNameStyle: {
    fontSize: 14,
    fontFamily: fontFamily.rubik_medium,
    marginLeft: 10,
  },
  profileImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  rightIcons: {
    width: 20,
    height: 20,
    resizeMode: 'cover',
    opacity: 0.8,
  },
  rightIconsContainer: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
});

export default TopChatComponent;
