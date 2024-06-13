import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import InvestHomeScreen from './InvestHomeScreen';
import AboutScreen from '../AboutScreen';
import AddCoffeeScreen from '../AddCoffeeScreen';
import colors from '../../styles/colors';
import fontFamily from '../../styles/fontFamily';
import WorkOutHomeScreen from '../Fitness/WorkOutHomeScreen';
import InvestProfileScreen from './InvestProfileScreen';

export default function InvestBottomTab() {
  const [selectedScreen, setSelectedScreen] = useState(0);
  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1}}>
        {selectedScreen === 0 ? (
          <InvestHomeScreen />
        ) : selectedScreen === 1 ? (
          <AboutScreen />
        ) : selectedScreen === 2 ? (
          <AddCoffeeScreen />
        ) : selectedScreen === 3 ? (
          <InvestProfileScreen setSelectedScreen={setSelectedScreen} />
        ) : null}
      </View>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => setSelectedScreen(0)}
          style={styles.iconContainer}>
          <View style={{alignItems: 'center'}}>
            <Image
              source={
                selectedScreen == 0
                  ? require('../../assets/invest/home.png')
                  : require('../../assets/invest/home-empty.png')
              }
              style={[
                styles.iconStyle,
                {
                  tintColor:
                    selectedScreen === 0 ? colors.invest_green : colors.gray,
                },
              ]}
            />
            <Text
              style={[
                styles.txt,
                {
                  color:
                    selectedScreen === 0 ? colors.invest_green : colors.gray,
                },
              ]}>
              Home
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSelectedScreen(1)}
          style={styles.iconContainer}>
          <View style={{alignItems: 'center'}}>
            <Image
              source={require('../../assets/tab_search.png')}
              style={[
                styles.iconStyle,
                {
                  tintColor:
                    selectedScreen === 1 ? colors.invest_green : colors.gray,
                },
              ]}
            />
            <Text
              style={[
                styles.txt,
                {
                  color:
                    selectedScreen === 1 ? colors.invest_green : colors.gray,
                },
              ]}>
              Product
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSelectedScreen(2)}
          style={styles.iconContainer}>
          <View style={{alignItems: 'center'}}>
            <Image
              source={require('../../assets/invest/trans.png')}
              style={[
                styles.iconStyle,
                {
                  tintColor:
                    selectedScreen === 2 ? colors.invest_green : colors.gray,
                },
              ]}
            />
            <Text
              style={[
                styles.txt,
                {
                  color:
                    selectedScreen === 2 ? colors.invest_green : colors.gray,
                },
              ]}>
              Transaction
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSelectedScreen(3)}
          style={[styles.iconContainer, {alignItems: 'flex-end'}]}>
          <View style={{alignItems: 'center'}}>
            <Image
              source={require('../../assets/invest/user.png')}
              style={[
                styles.iconStyle,
                {
                  tintColor:
                    selectedScreen === 3 ? colors.invest_green : colors.gray,
                },
              ]}
            />
            <Text
              style={[
                styles.txt,
                {
                  color:
                    selectedScreen === 3 ? colors.invest_green : colors.gray,
                },
              ]}>
              Account
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: Platform.OS === 'android' ? 60 : 70,
    backgroundColor: colors.wallpaper_white,
    borderTopWidth: 0.6,
    borderTopColor: colors.todoGray,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 34,
    paddingTop: 8,
  },
  iconStyle: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  iconContainer: {
    alignItems: 'flex-start',
    flex: 1,
  },
  txt: {
    fontSize: 11,
    color: colors.black,
    marginTop: 4,
    fontFamily: fontFamily.rubik_semi_bold,
  },
});
