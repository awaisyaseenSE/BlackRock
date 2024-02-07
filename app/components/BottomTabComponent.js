import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {getResponsiveHeight} from '../utils/getResponsiveMarginPadding';
import fontFamily from '../styles/fontFamily';
import colors from '../styles/colors';
import auth from '@react-native-firebase/auth';

const BottomTabComponent = ({selectedScreen, setSelectedScreen}) => {
  const userProfileImage = auth()?.currentUser?.photoURL;
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => setSelectedScreen(0)}>
        <Image
          source={require('../assets/tab_home.png')}
          style={[
            styles.iconStyle,
            {tintColor: selectedScreen === 0 ? colors.darkBlue : colors.black},
          ]}
        />
        <Text
          style={[
            styles.text,
            {
              color: selectedScreen === 0 ? colors.darkBlue : colors.black,
            },
          ]}>
          Home
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => setSelectedScreen(1)}>
        <Image
          source={require('../assets/tab_search.png')}
          style={[
            styles.iconStyle,
            {tintColor: selectedScreen === 1 ? colors.darkBlue : colors.black},
          ]}
        />
        <Text
          style={[
            styles.text,
            {
              color: selectedScreen === 1 ? colors.darkBlue : colors.black,
            },
          ]}>
          Search
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => setSelectedScreen(2)}>
        <Image
          source={require('../assets/bell.png')}
          style={[
            styles.iconStyle,
            {tintColor: selectedScreen === 2 ? colors.darkBlue : colors.black},
          ]}
        />
        <Text
          style={[
            styles.text,
            {
              color: selectedScreen === 2 ? colors.darkBlue : colors.black,
            },
          ]}>
          Notification
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => setSelectedScreen(3)}>
        <Image
          source={
            userProfileImage !== undefined &&
            userProfileImage !== null &&
            userProfileImage !== ''
              ? {uri: userProfileImage}
              : require('../assets/user.png')
          }
          style={[
            !!userProfileImage ? styles.profileImage : styles.iconStyle,
            {
              tintColor: !userProfileImage
                ? selectedScreen === 3
                  ? colors.darkBlue
                  : colors.black
                : null,
            },
          ]}
        />
        <Text
          style={[
            styles.text,
            {
              color: selectedScreen === 3 ? colors.darkBlue : colors.black,
            },
          ]}>
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // height: getResponsiveHeight(10),
    height: 80,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingBottom: 8,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  iconStyle: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
    tintColor: colors.black,
  },
  iconContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  text: {
    fontSize: 10,
    fontFamily: fontFamily.rubik_regular,
    color: colors.black,
    marginTop: 4,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
});

export default BottomTabComponent;
