import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import ScreenComponent from '../components/ScreenComponent';
import {useNavigation} from '@react-navigation/native';
import colors from '../styles/colors';
import TopCompoWithHeading from '../components/TopCompoWithHeading';
import ButtonComponent from '../components/ButtonComponent';
import navigationStrings from '../navigation/navigationStrings';

export default function AboutScreen() {
  const navigation = useNavigation();

  const handleNavigate = () => {
    navigation.navigate(navigationStrings.MAIN_TAB_ROUTES, {screenNo: 3});
  };

  return (
    <>
      <ScreenComponent>
        <View style={styles.container}>
          <TopCompoWithHeading
            title="About"
            onPress={() => navigation.goBack()}
          />
          <ButtonComponent
            title="Profile"
            style={styles.btn}
            onPress={handleNavigate}
          />
        </View>
      </ScreenComponent>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 20,
    color: colors.lightBlack,
  },
  btn: {
    width: '60%',
    marginTop: 20,
    alignSelf: 'center',
  },
});
