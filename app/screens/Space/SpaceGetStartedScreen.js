import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import React from 'react';
import ButtonComponent from '../../components/ButtonComponent';
import colors from '../../styles/colors';
import Svg, {Circle} from 'react-native-svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import fontFamily from '../../styles/fontFamily';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../../navigation/navigationStrings';

const {width, height} = Dimensions.get('window');

export default function SpaceGetStartedScreen() {
  const navigation = useNavigation();
  const generateStars = (numStars = 12) => {
    let stars = [];
    for (let i = 0; i < numStars; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      stars.push({x, y});
    }
    return stars;
  };

  const stars = generateStars();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.heading}>Explore the{'\n'}Universe</Text>
        <Text style={styles.light}>
          Journey through the cosmose with our space app
        </Text>
        <ButtonComponent
          title="Get Started"
          style={styles.btn}
          textStyle={{
            color: colors.space_Black,
            fontFamily: fontFamily.rubik_semi_bold,
            fontSize: 16,
          }}
          onPress={() => navigation.navigate(navigationStrings.SpaceHomeScreen)}
        />
      </View>
      <View style={{flex: 1.9}}>
        {stars &&
          stars.map((star, index) => (
            <Image
              key={index}
              source={require('../../assets/space/star.png')}
              style={{
                position: 'absolute',
                left: star.x,
                top: star.y,
                width: index % 2 == 0 ? 8 : 4,
                height: index % 2 == 0 ? 8 : 4,
              }}
              resizeMode="contain"
            />
          ))}
        <View style={styles.earchContainer}>
          <Image
            source={require('../../assets/space/earth.png')}
            style={styles.earth}
            blurRadius={1}
          />
        </View>
        <View style={styles.marsContainer}>
          <Image
            source={require('../../assets/space/mars.png')}
            style={styles.mars}
          />
        </View>
        <View style={styles.planetContainer}>
          <Image
            source={require('../../assets/space/mercury.png')}
            style={styles.planet}
          />
        </View>
        <View style={styles.planetContainer1}>
          <Image
            source={require('../../assets/space/planet.png')}
            style={styles.planet}
          />
        </View>
        <View style={styles.planetContainer2}>
          <Image
            source={require('../../assets/space/red.png')}
            style={styles.planet1}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.space_Black,
  },
  earth: {
    width: 200,
    height: 200,
  },
  earchContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mars: {
    width: 90,
    height: 90,
  },
  marsContainer: {
    position: 'absolute',
    top: 60,
    right: 0,
  },
  planet: {
    width: 80,
    height: 80,
  },
  planetContainer: {
    position: 'absolute',
    top: 120,
    left: -10,
  },
  planetContainer1: {
    position: 'absolute',
    bottom: 6,
    left: 0,
  },
  planetContainer2: {
    position: 'absolute',
    bottom: -14,
    right: -16,
  },
  planet1: {
    width: 160,
    height: 160,
  },
  heading: {
    fontSize: 32,
    color: colors.white,
    fontFamily: fontFamily.rubik_bold,
  },
  topContainer: {
    flex: 1.1,
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 10,
  },
  light: {
    fontSize: 16,
    fontFamily: fontFamily.rubik_medium,
    color: colors.space_gray,
    width: '70%',
    marginTop: 14,
  },
  btn: {
    backgroundColor: colors.offWhite,
    borderRadius: 8,
    marginTop: 24,
    width: '54%',
  },
});
