import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  Dimensions,
  TouchableOpacity,
  Alert,
  ImageBackground,
  FlatList,
  StatusBar,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import ScreenComponent from '../../components/ScreenComponent';
import colors from '../../styles/colors';
import fontFamily from '../../styles/fontFamily';
import ButtonComponent from '../../components/ButtonComponent';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../../navigation/navigationStrings';
import InvestTopCompo from './components/InvestTopCompo';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ShowInvestDetailModal from './components/ShowInvestDetailModal';
import InvestListItemCompo from './components/InvestListItemCompo';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function InvestProfileScreen({setSelectedScreen}) {
  return (
    <>
      <ScreenComponent
        content={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}>
        <View style={styles.container}>
          <InvestTopCompo onPress={() => setSelectedScreen(0)} />
          <Text style={styles.heading}>Profile</Text>
          <View style={{alignItems: 'center', marginTop: 14}}>
            <FastImage
              source={{
                uri: 'https://cdn.pixabay.com/photo/2024/06/08/04/19/ai-generated-8815780_1280.jpg',
              }}
              style={styles.profileImg}
            />
            <Text style={styles.nameTxt}>Sarah Garcia</Text>
            <Text style={styles.subHeading}>Expert</Text>
          </View>
          <View style={{marginTop: 28}}>
            <InvestListItemCompo
              title="Contact Info"
              icon={require('../../assets/invest/contact-user.png')}
            />
            <InvestListItemCompo
              title="Source of Finding Info"
              icon={require('../../assets/invest/fund.png')}
            />
            <InvestListItemCompo
              title="Bank Account Info"
              icon={require('../../assets/invest/bank.png')}
            />
            <InvestListItemCompo
              title="Document Info"
              icon={require('../../assets/invest/list-user.png')}
            />
            <InvestListItemCompo
              title="Settings"
              icon={require('../../assets/invest/setting.png')}
            />
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
    marginTop: 10,
  },
  heading: {
    fontSize: 22,
    color: colors.black,
    fontFamily: fontFamily.rubik_semi_bold,
    paddingHorizontal: 8,
    marginTop: 10,
  },
  profileImg: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  nameTxt: {
    fontSize: 16,
    color: colors.black,
    fontFamily: fontFamily.rubik_medium,
    marginTop: 10,
    marginBottom: 2,
  },
  subHeading: {
    fontSize: 14,
    fontFamily: fontFamily.lato_regular,
    color: colors.black,
  },
});
