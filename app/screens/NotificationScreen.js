import {View, Text} from 'react-native';
import React from 'react';
import ScreenComponent from '../components/ScreenComponent';
import ButtonComponent from '../components/ButtonComponent';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../navigation/navigationStrings';

export default function NotificationScreen() {
  const navigation = useNavigation();

  const handleNavigate = () => {
    navigation.navigate(navigationStrings.MAIN_TAB_ROUTES, {screenNo: 3});
  };

  return (
    <>
      <ScreenComponent>
        <View style={{flexGrow: 1, backgroundColor: 'lightcoral'}}>
          <Text>NotificationScreen</Text>
          <ButtonComponent title="Profile" onPress={handleNavigate} />
        </View>
      </ScreenComponent>
    </>
  );
}
