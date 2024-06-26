import {Image, StyleSheet, Platform} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import colors from '../styles/colors';
import auth from '@react-native-firebase/auth';
import SearchScreen from '../screens/SearchScreen';
import NotificationScreen from '../screens/NotificationScreen';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Animated, {Value3D} from 'react-native-reanimated';
import {CachedImage} from '../utils/CachedImage';

const BottomTab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const insets = useSafeAreaInsets();
  const isIOS = Platform.OS === 'ios';

  return (
    <BottomTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: colors.lineColor,
        tabBarInactiveTintColor: colors.gray,
        tabBarStyle: {
          backgroundColor: colors.bottomTabBg,
          borderRadius: 40,
          position: 'absolute',
          marginHorizontal: 12,
          bottom: Platform.OS === 'android' ? 10 : insets.bottom - 12,
          borderTopWidth: 0,
          paddingVertical: 12,
          height: 80,
          paddingBottom: isIOS ? 14 : 16,
        },
      }}
      initialRouteName="ProfileScreen">
      <BottomTab.Screen
        component={HomeScreen}
        name="HomeScreen"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({focused}) => {
            return (
              <Image
                source={require('../assets/tab_home.png')}
                style={[
                  styles.iconStyle,
                  {tintColor: focused ? colors.lineColor : colors.gray},
                ]}
              />
            );
          },
        }}
      />
      <BottomTab.Screen
        component={SearchScreen}
        name="SearchScreen"
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({focused}) => {
            return (
              <Image
                source={require('../assets/tab_search.png')}
                style={[
                  styles.iconStyle,
                  {tintColor: focused ? colors.lineColor : colors.gray},
                ]}
              />
            );
          },
        }}
      />
      <BottomTab.Screen
        component={NotificationScreen}
        name="NotificationScreen"
        options={{
          tabBarLabel: 'Photos',
          tabBarIcon: ({focused}) => {
            return (
              <Image
                source={require('../assets/photos.png')}
                style={[
                  styles.iconStyle,
                  {
                    opacity: focused ? 0.8 : 0.4,
                  },
                ]}
              />
            );
          },
        }}
      />
      <BottomTab.Screen
        component={ProfileScreen}
        name="ProfileScreen"
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({focused}) => {
            return (
              // <Image
              //   source={
              //     !!auth()?.currentUser?.photoURL
              //       ? {uri: auth()?.currentUser?.photoURL}
              //       : require('../assets/user.png')
              //   }
              //   style={
              //     !!auth()?.currentUser?.photoURL
              //       ? styles.profileImageStyle
              //       : [
              //           styles.iconStyle,
              //           {tintColor: focused ? colors.lineColor : colors.gray},
              //         ]
              //   }
              //   defaultSource={require('../assets/avatar.png')}
              // />

              !!auth()?.currentUser?.photoURL ? (
                <CachedImage
                  uri={auth()?.currentUser?.photoURL}
                  style={
                    !!auth()?.currentUser?.photoURL
                      ? styles.profileImageStyle
                      : [
                          styles.iconStyle,
                          {tintColor: focused ? colors.lineColor : colors.gray},
                        ]
                  }
                  defaultSource={require('../assets/avatar.png')}
                />
              ) : (
                <Image
                  source={require('../assets/user.png')}
                  style={[
                    styles.iconStyle,
                    {tintColor: focused ? colors.lineColor : colors.gray},
                  ]}
                />
              )
            );
          },
        }}
      />
    </BottomTab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconStyle: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  profileImageStyle: {
    width: 26,
    height: 26,
    borderRadius: 13,
  },
});

export default BottomTabNavigator;
