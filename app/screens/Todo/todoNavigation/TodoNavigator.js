import {View, Text} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TodoScreen from '../screens/TodoScreen';
import CreateTodoScreen from '../screens/CreateTodoScreen';

const Stack = createNativeStackNavigator();

export default function TodoNavigator() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="TodoScreen"
            component={TodoScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="CreateTodoScreen"
            component={CreateTodoScreen}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
