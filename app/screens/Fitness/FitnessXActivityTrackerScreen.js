import {
  View,
  Text,
  StyleSheet,
  Platform,
  Image,
  StatusBar,
  Alert,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import FitnessXButtonCompo from '../../components/FitnessXButtonCompo';
import fontFamily from '../../styles/fontFamily';
import colors from '../../styles/colors';
import ScreenComponent from '../../components/ScreenComponent';
import TopCompoWithHeading from '../../components/TopCompoWithHeading';

export default function FitnessXActivityTrackerScreen() {
  const navigation = useNavigation();
  return (
    <>
      <ScreenComponent style={{backgroundColor: colors.fitnessWhite}}>
        <StatusBar backgroundColor={colors.white} barStyle={'dark-content'} />
        <TopCompoWithHeading
          title="Activity Tracker"
          titleStyle={{color: colors.black}}
          backIconStyle={{tintColor: colors.black}}
          onPress={() => navigation.goBack()}
          rightIcon={require('../../assets/two-dots.png')}
          rightIconStyle={{tintColor: colors.black, width: 14, height: 14}}
          rightIconContainerStyle={{backgroundColor: colors.fitnessLigthWhite}}
        />
        <View style={styles.container}>
          <View style={styles.topContainer}>
            <Text style={styles.heading}>Today Target</Text>
            <TouchableOpacity>
              {/* <Image source={require('../../assets/')} /> */}
            </TouchableOpacity>
          </View>
        </View>
      </ScreenComponent>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 14,
    color: colors.black,
    fontFamily: fontFamily.rubik_semi_bold,
  },
  topContainer: {
    backgroundColor: colors.fitnessLigthWhite2,
    padding: 16,
    borderRadius: 12,
  },
});
