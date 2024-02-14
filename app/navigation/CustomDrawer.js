import React from 'react';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import {Alert, View, Text, Platform, StyleSheet} from 'react-native';
import auth, {firebase} from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import useAuth from '../auth/useAuth';
import DrawerItemListCompo from './DrawerItemListCompo';
import navigationStrings from '../navigation/navigationStrings';
import firestore from '@react-native-firebase/firestore';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import FastImage from 'react-native-fast-image';

function CustomDrawer(props) {
  const navigation = useNavigation();
  const {logout} = useAuth();
  const userProfileImage = auth()?.currentUser?.photoURL;

  const handleLogout = () => {
    try {
      Alert.alert('Logout', 'Are you sure to Logout!', [
        {
          text: 'Yes',
          onPress: logout,
        },
        {
          text: 'No',
        },
      ]);
    } catch (error) {
      console.log('============ERROR WHILE LOG OUT========================');
      console.log(error);
      console.log('====================================');
    }
  };

  return (
    <>
      <DrawerContentScrollView
        style={{
          backgroundColor: colors.lightBlackTwo,
          width: '100%',
          paddingHorizontal: 12,
        }}
        showsVerticalScrollIndicator={false}>
        <FastImage
          source={
            !!userProfileImage
              ? {uri: userProfileImage}
              : require('../assets/avatar.png')
          }
          style={styles.profileImage}
        />
        <Text
          style={[
            styles.userNameText,
            {marginTop: Platform.OS === 'android' ? 10 : 0},
          ]}>
          {!!auth().currentUser?.displayName
            ? auth()?.currentUser?.displayName
            : 'Anonymous'}
        </Text>
        <View style={{flex: 1, marginTop: 18}}>
          <DrawerItemListCompo
            image={require('../assets/favorite.png')}
            title="Real Time Database"
            onPress={() =>
              navigation.navigate(navigationStrings.REAL_TIME_DATABASE)
            }
          />
          <DrawerItemListCompo
            image={require('../assets/user.png')}
            title="About"
            onPress={() => navigation.navigate(navigationStrings.ABOUT_SCREEN)}
          />
          <DrawerItemListCompo
            image={require('../assets/dragon-logo.png')}
            title="OnBoarding"
            onPress={() =>
              navigation.navigate(navigationStrings.ONBOARDING_SCREEN)
            }
          />
        </View>
      </DrawerContentScrollView>
      <View
        style={{
          paddingVertical: 24,
          paddingHorizontal: 12,
          // backgroundColor: '#FFFFFF',
          backgroundColor: colors.lightBlack,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.36,
          shadowRadius: 6.68,

          elevation: 11,
        }}>
        <DrawerItemListCompo
          image={require('../assets/back.png')}
          title="Logout"
          style={{marginBottom: Platform.OS === 'ios' ? 8 : 2}}
          onPress={handleLogout}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  userNameText: {
    fontSize: 14,
    color: colors.black,
    fontFamily: fontFamily.rubik_medium,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginTop: 12,
  },
});

export default CustomDrawer;
