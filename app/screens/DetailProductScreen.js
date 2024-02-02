import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import ScreenComponent from '../components/ScreenComponent';
import fontFamily from '../styles/fontFamily';
import colors from '../styles/colors';
import TopCompoWithHeading from '../components/TopCompoWithHeading';
import Animated from 'react-native-reanimated';

export default function DetailProductScreen({route}) {
  const navigation = useNavigation();
  const routeData = route?.params?.data;
  return (
    <>
      <ScreenComponent>
        <TopCompoWithHeading
          title="Detail Product"
          onPress={() => navigation.goBack()}
        />
        <View style={{marginVertical: 8, alignItems: 'center'}}>
          <Animated.Image
            source={{uri: routeData?.src?.landscape}}
            style={styles.image}
          />
        </View>
      </ScreenComponent>
    </>
  );
}

const styles = StyleSheet.create({
  container: {},
  txt: {
    fontSize: 20,
    alignSelf: 'center',
    marginVertical: 10,
    fontFamily: fontFamily.lato_bold,
    color: colors.darkBlue,
  },
  image: {
    width: '60%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 8,
  },
});
