import {View, Text} from 'react-native';
import React, {useState} from 'react';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import NotificationScreen from '../screens/NotificationScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BottomTabComponent from '../components/BottomTabComponent';

const TabRoutes = () => {
  const [selectedScreen, setSelectedScreen] = useState(0);

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1}}>
        {selectedScreen === 0 ? (
          <HomeScreen />
        ) : selectedScreen === 1 ? (
          <SearchScreen />
        ) : selectedScreen === 2 ? (
          <NotificationScreen />
        ) : selectedScreen === 3 ? (
          <ProfileScreen />
        ) : null}
      </View>
      <BottomTabComponent
        selectedScreen={selectedScreen}
        setSelectedScreen={setSelectedScreen}
      />
    </View>
  );
};

export default TabRoutes;
