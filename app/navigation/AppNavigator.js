import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabRoutes from './TabRoutes';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawer from './CustomDrawer';
import AboutScreen from '../screens/AboutScreen';
import {Dimensions, Platform} from 'react-native';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const {width, height} = Dimensions.get('window');

const DrawerNavigator = () => (
  <>
    <Drawer.Navigator
      // initialRouteName="TabRoutes"
      // screenOptions={{
      //   headerShown: false,
      //   drawerPosition: 'left',
      //   drawerActiveBackgroundColor: 'transparent',
      //   drawerInactiveBackgroundColor: 'transparent',
      // }}
      screenOptions={{
        drawerStyle: {
          width: width * 0.7,
          alignSelf: 'center',
        },
        sceneContainerStyle: {
          // backgroundColor: '#FFFFFF33',
        },
        swipeEdgeWidth: Platform.OS === 'android' && 100,
        headerShown: false,
        drawerPosition: 'left',
        drawerActiveBackgroundColor: 'transparent',
        drawerInactiveBackgroundColor: 'transparent',
        drawerActiveTintColor: 'red',
        drawerInactiveTintColor: 'green',
        overlayColor: 'transparent',
      }}
      drawerContent={props => <CustomDrawer {...props} />}>
      <Drawer.Screen
        name="TabRoutes"
        component={TabRoutes}
        options={{headerShown: false}}
      />
    </Drawer.Navigator>
  </>
);

function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="MainTabRoutes">
      <Stack.Screen
        name="MainTabRoutes"
        component={DrawerNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AboutScreen"
        component={AboutScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
          // animationTypeForReplace: 'push',
          // animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
}
export default AppNavigator;
