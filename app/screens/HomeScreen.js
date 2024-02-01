import {View, Text, StyleSheet, FlatList, ScrollView} from 'react-native';
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
          <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
              <Text style={styles.heading}>Welcome to Home Screen</Text>
              <ButtonComponent
                title="Logout"
                style={styles.btn}
                onPress={handleLogout}
              />
              <FlatList
                data={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
                renderItem={() => (
                  <View
                    style={{
                      // borderWidth: 1,
                      // borderColor: colors.borderColor,
                      marginVertical: 20,
                      alignItems: 'center',
                    }}>
                    <Text style={{fontSize: 30, color: colors.lightBlack}}>
                      Hello This is a text components
                    </Text>
                  </View>
                )}
                scrollEnabled={false}
              />
            </View>
          </ScrollView>
        </ScreenComponent>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 40,
  },
  heading: {
    fontSize: 20,
    marginVertical: 10,
    color: colors.blue,
    fontFamily: fontFamily.lato_bold,
    alignSelf: 'center',
  },
  btn: {
    width: '60%',
    borderRadius: 12,
    marginBottom: 30,
    alignSelf: 'center',
    marginTop: 8,
  },
});
