import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabRoutes from './TabRoutes';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawer from './CustomDrawer';
import AboutScreen from '../screens/AboutScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerNavigator = () => (
  <>
    <Drawer.Navigator
      initialRouteName="TabRoutes"
      screenOptions={{
        headerShown: false,
        drawerPosition: 'left',
        drawerActiveBackgroundColor: 'transparent',
        drawerInactiveBackgroundColor: 'transparent',
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
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
export default AppNavigator;
