import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Image,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenComponent from './ScreenComponent';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import FastImage from 'react-native-fast-image';
import {allCitiesPk} from '../utils/pakistanCitiesData';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const ShowAddressModal = ({showModal = false, setShowModal}) => {
  const [selectCity, setSelectCity] = useState(false);
  const renderItem = ({item}) => {
    return (
      <View>
        <Text>{item}</Text>
      </View>
    );
  };
  return (
    <Modal visible={showModal} transparent animationType="slide">
      <ScreenComponent style={{backgroundColor: 'rgba(0, 0, 0, 0.6)'}}>
        <TouchableOpacity
          style={{flex: 1}}
          onPress={() => setShowModal(false)}
        />
        <View style={styles.container}>
          <View style={styles.topContainer}>
            <TouchableOpacity
              style={styles.closeIconContainer}
              activeOpacity={0.8}
              onPress={() => setShowModal(false)}>
              <Image
                source={require('../assets/close.png')}
                style={styles.closeIcon}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.countrySelectContainer}
            activeOpacity={0.8}
            onPress={() => setSelectCity(!selectCity)}>
            <Image
              source={require('../assets/coffee/town-hall.png')}
              style={[styles.icon, {marginRight: 8}]}
            />
            <Text style={styles.heading}>Select City</Text>
            <Image
              source={
                selectCity
                  ? require('../assets/food/upward-arrow.png')
                  : require('../assets/food/downward-arrow.png')
              }
              style={[styles.icon, {marginLeft: 10}]}
            />
          </TouchableOpacity>

          {selectCity && (
            <View style={{flex: 1}}>
              <FlatList
                data={allCitiesPk}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
              />
            </View>
          )}
        </View>
        <TouchableOpacity
          style={{flex: 1}}
          onPress={() => setShowModal(false)}
        />
      </ScreenComponent>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: screenHeight / 2,
    backgroundColor: colors.food_gray,
    borderRadius: 12,
    padding: 20,
  },
  closeIcon: {
    width: 12,
    height: 12,
    tintColor: colors.black,
  },
  closeIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.food_Light_yellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',

    marginBottom: 14,
  },
  heading: {
    fontSize: 18,
    fontFamily: fontFamily.lato_bold,
    color: colors.food_light_black2,
  },
  icon: {
    width: 20,
    height: 20,
  },
  countrySelectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  countryName: {
    fontSize: 14,
    color: colors.black,
  },
  countryContainer: {
    marginBottom: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.food_Light_yellow,
    paddingHorizontal: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon2: {
    width: 24,
    height: 24,
    tintColor: colors.food_yellow,
    marginRight: 10,
  },
});

export default ShowAddressModal;
