import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import colors from '../../../styles/colors';
import fontFamily from '../../../styles/fontFamily';
import LinearGradient from 'react-native-linear-gradient';
import navigationStrings from '../../../navigation/navigationStrings';
import {useNavigation} from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const BodyPartCard = ({item, index}) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        navigation.navigate(navigationStrings.WorkOut_Detail_Screen, {
          data: item,
        })
      }>
      <FastImage
        source={{uri: item?.image}}
        style={styles.imageStyle}
        defaultSource={require('../../../assets/food/picture.png')}
      />
      <View style={styles.mainContent}>
        <LinearGradient
          start={{x: 0.5, y: 2}}
          end={{x: 0.5, y: 1}}
          colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.4)']}
          style={styles.linearGradientStyle}>
          <Text style={styles.heading}>{item?.name}</Text>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: screenWidth / 2 - 20,
    height: screenHeight / 5,
    marginBottom: 12,
  },
  imageStyle: {
    width: null,
    height: null,
    flex: 1,
    borderRadius: 12,
  },
  heading: {
    fontSize: 16,
    color: colors.LightWhite,
    textTransform: 'capitalize',
    fontFamily: fontFamily.rubik_medium,
  },
  mainContent: {
    position: 'absolute',
    bottom: 8,
    width: '100%',
    alignItems: 'center',
    height: 40,
  },
  linearGradientStyle: {
    width: '100%',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});

export default BodyPartCard;
