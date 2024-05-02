import {
  View,
  Text,
  StyleSheet,
  Platform,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import FitnessXButtonCompo from '../../components/FitnessXButtonCompo';
import fontFamily from '../../styles/fontFamily';
import colors from '../../styles/colors';
import navigationStrings from '../../navigation/navigationStrings';
import FastImage from 'react-native-fast-image';

export default function FitnessXOnboardingScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleOnPress = () => {
    if (selectedIndex === 0) {
      setSelectedIndex(1);
    } else if (selectedIndex === 1) {
      setSelectedIndex(2);
    } else if (selectedIndex === 2) {
      navigation.navigate(navigationStrings.WorkOut_Home_Screen);
    } else {
      setSelectedIndex(0);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <StatusBar backgroundColor={colors.white} barStyle={'dark-content'} />
        {/* <LinearGradient
          style={{flex: 1}}
          start={{x: 1, y: 2}}
          end={{x: 0, y: 0}}
          colors={
            selectedIndex === 0
              ? ['#9AC2FF', '#94ADFF', '#97BBFF']
              : ['#F8F8F8', '#FFFFFF', '#F8F8F8']
          }> */}
        <View
          style={
            selectedIndex === 2 ? styles.mainContainer1 : styles.mainContainer
          }>
          {selectedIndex === 2 ? (
            <View
              style={{
                alignItems: 'center',
                flex: 1,
                backgroundColor: colors.food_gray,
              }}>
              <FastImage
                source={{
                  uri: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Z3ltJTIwcG5nfGVufDB8MXwwfHx8MA%3D%3D',
                }}
                style={styles.image}
              />
              <View style={styles.viewStyle}>
                <Text
                  style={[
                    styles.heading,
                    {fontSize: 20, color: colors.LightWhite},
                  ]}>
                  Stay Fit
                </Text>
                <Text
                  style={[
                    styles.subheading,
                    {
                      fontSize: 16,
                      color: colors.LightWhite,
                      textAlign: 'center',
                      width: '60%',
                    },
                  ]}>
                  You are all set now, let's reach your goals together with us
                </Text>
              </View>
            </View>
          ) : (
            <View>
              <Text style={styles.heading}>
                Fitness
                <Text
                  style={{
                    color:
                      selectedIndex === 0
                        ? colors.fitnessLigthWhite
                        : colors.dark_Red,
                    fontSize: 34,
                  }}>
                  X
                </Text>
              </Text>
              <Text style={styles.subheading}>Everybody Can Train</Text>
            </View>
          )}
          <FitnessXButtonCompo
            title={selectedIndex === 2 ? 'Get Started' : 'Next'}
            style={{
              ...styles.btn,
              backgroundColor:
                selectedIndex === 0
                  ? colors.fitnessLigthWhite
                  : colors.dark_Red,
            }}
            onPress={handleOnPress}
            textStyle={{
              color:
                selectedIndex === 0
                  ? colors.fitnessDarkPurple
                  : colors.fitnessLigthWhite,
            }}
          />
        </View>
        {/* </LinearGradient> */}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.food_gray,
  },
  mainContainer1: {
    flex: 1,
  },
  heading: {
    fontSize: 30,
    fontFamily: fontFamily.rubik_bold,
    color: colors.black,
  },
  subheading: {
    fontSize: 16,
    fontFamily: fontFamily.rubik_regular,
    color: colors.lightBlack,
    marginTop: 8,
  },
  btn: {
    width: '80%',
    position: 'absolute',
    bottom: 40,
    height: 50,
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  viewStyle: {
    position: 'absolute',
    bottom: 130,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
  },
});
