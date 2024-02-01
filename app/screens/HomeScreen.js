import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import ScreenComponent from '../components/ScreenComponent';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import ButtonComponent from '../components/ButtonComponent';
import useAuth from '../auth/useAuth';

export default function HomeScreen() {
  const {logout} = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <LinearGradient
        start={{x: 1, y: 0}}
        end={{x: 0, y: 1}}
        colors={['#F5F5F5', '#F9F9F9', '#E3F7FF']}
        style={{flex: 1}}>
        <ScreenComponent>
          <View style={styles.container}>
            <Text style={styles.heading}>Welcome to Home Screen</Text>
            <ButtonComponent
              title="Logout"
              style={styles.btn}
              onPress={handleLogout}
            />
          </View>
        </ScreenComponent>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heading: {
    fontSize: 20,
    marginVertical: 10,
    color: colors.blue,
    fontFamily: fontFamily.lato_bold,
  },
  btn: {
    width: '60%',
    borderRadius: 12,
    marginBottom: 30,
  },
});
