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
      navigation.navigate(navigationStrings.FitnessX_Activity_Tracker_Screen);
    } else {
      setSelectedIndex(0);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <StatusBar backgroundColor={colors.white} barStyle={'dark-content'} />
        <LinearGradient
          style={{flex: 1}}
          start={{x: 1, y: 2}}
          end={{x: 0, y: 0}}
          colors={
            selectedIndex === 0
              ? ['#9AC2FF', '#94ADFF', '#97BBFF']
              : ['#F8F8F8', '#FFFFFF', '#F8F8F8']
          }>
          <View style={[styles.mainContainer]}>
            {selectedIndex === 2 ? (
              <View
                style={{
                  alignItems: 'center',
                  paddingHorizontal: 22,
                }}>
                <Image
                  source={require('../../assets/fitness.png')}
                  style={styles.image}
                />
                <Text style={[styles.heading, {fontSize: 20}]}>
                  Welcome, Stefani
                </Text>
                <Text style={[styles.subheading, {fontSize: 16}]}>
                  You are all set now, let's reach your goals together with us
                </Text>
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
                          : colors.fitnessDarkPurple,
                      fontSize: 34,
                    }}>
                    X
                  </Text>
                </Text>
                <Text style={styles.subheading}>Everybody Can Train</Text>
              </View>
            )}
            <FitnessXButtonCompo
              title={selectedIndex === 2 ? 'Go To Home' : 'Get Started'}
              style={{
                ...styles.btn,
                backgroundColor:
                  selectedIndex === 0
                    ? colors.fitnessLigthWhite
                    : colors.fitnessDarkPurple,
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
        </LinearGradient>
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
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});
