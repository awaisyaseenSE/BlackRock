import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Platform,
  StatusBar,
} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import colors from '../../styles/colors';
import fontFamily from '../../styles/fontFamily';
import LinearGradient from 'react-native-linear-gradient';
import navigationStrings from '../../navigation/navigationStrings';
import Animated, {FadeInDown} from 'react-native-reanimated';

export default function WalllOnBoardingScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  return (
    <>
      <View style={styles.container}>
        <StatusBar backgroundColor={colors.black} barStyle={'light-content'} />
        <ImageBackground
          style={styles.backgroundImg}
          source={require('../../assets/wallpaper/wall-2.png')}>
          <View style={{flex: 1}}></View>
          <View style={{flex: 1.2}}>
            <LinearGradient
              style={{flex: 1}}
              start={{x: 0.5, y: 0}}
              end={{x: 0.5, y: 0.8}}
              colors={[
                'rgba(255,255,255,0)',
                'rgba(255,255,255,0.5)',
                colors.lightOffWhite,
                colors.lightOffWhite,
              ]}>
              <View
                style={[
                  styles.contentContainer,
                  {
                    paddingBottom:
                      Platform.OS === 'ios' ? insets.bottom + 10 : 30,
                  },
                ]}>
                <Animated.Text
                  entering={FadeInDown.delay(400).springify()}
                  style={styles.heading}>
                  WallJet
                </Animated.Text>
                <Animated.Text
                  style={styles.subheading}
                  entering={FadeInDown.delay(500).springify()}>
                  Unlock stories with every pixel
                </Animated.Text>
                <Animated.View
                  style={{width: '100%', alignItems: 'center'}}
                  yle={styles.subheading}
                  entering={FadeInDown.delay(600).springify()}>
                  <TouchableOpacity
                    style={styles.btn}
                    activeOpacity={0.6}
                    onPress={() =>
                      navigation.navigate(
                        navigationStrings.Wallpaper_Home_Screen,
                      )
                    }>
                    <Text style={styles.txt}>Start Explore</Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </LinearGradient>
          </View>
        </ImageBackground>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImg: {
    flex: 1,
    width: null,
    height: null,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
    alignItems: 'center',
  },
  heading: {
    fontSize: 34,
    color: colors.black,
    fontFamily: fontFamily.rubik_bold,
    marginBottom: 16,
  },
  subheading: {
    fontSize: 16,
    color: colors.black,
    fontFamily: fontFamily.rubik_medium,
    marginBottom: 16,
  },
  txt: {
    fontSize: 16,
    color: colors.white,
    fontFamily: fontFamily.rubik_medium,
  },
  btn: {
    backgroundColor: colors.black,
    width: '80%',
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 14,
  },
});
