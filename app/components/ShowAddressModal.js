import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Image,
  FlatList,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenComponent from './ScreenComponent';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import {allCitiesPk} from '../utils/pakistanCitiesData';
import TextInputCompo from './TextInputCompo';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const ShowAddressModal = ({
  showModal = false,
  setShowModal,
  userCity,
  setUserCity,
  userAddress,
  setUserAddress,
  userPostalCode,
  setUserPostalCode,
  userPhoneNumber,
  setUserPhoneNumber,
}) => {
  const [selectCity, setSelectCity] = useState(false);
  const [searchCity, setSearchCity] = useState('');
  const [searchBoxShow, setSearchBoxShow] = useState(false);
  const [cityData, setCityData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (allCitiesPk.length > 0) {
      setCityData(allCitiesPk);
      setFilteredData(allCitiesPk);
    }
  }, []);

  useEffect(() => {
    if (searchCity !== '') {
      handleSearch();
    } else {
      setCityData(allCitiesPk);
    }
  }, [searchCity]);

  const handleSearch = () => {
    try {
      const filtered = filteredData.filter(itm => {
        return itm.toLowerCase().includes(searchCity.toLowerCase());
      });
      setCityData(filtered);
    } catch (error) {
      console.log(
        'Error in while Searching available cities in show adress modal: ',
        error,
      );
    }
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.addressContainer}
        activeOpacity={0.6}
        onPress={() => {
          setUserCity(item);
          setSearchBoxShow(false);
          setSelectCity(false);
        }}>
        <Text style={styles.addressText}>{item}</Text>
      </TouchableOpacity>
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
          <TouchableWithoutFeedback
            style={{flex: 1}}
            onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
              style={{
                flex: 1,
                width: '100%',
              }}
              behavior={Platform.OS === 'ios' ? 'padding' : null}
              enabled
              keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}>
              <ScrollView
                style={{flex: 1}}
                showsVerticalScrollIndicator={false}>
                <View style={{}}>
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
                  <View style={styles.row}>
                    <TouchableOpacity
                      style={styles.countrySelectContainer}
                      activeOpacity={0.8}
                      onPress={() => {
                        setSelectCity(!selectCity);
                        if (searchBoxShow) {
                          setSearchBoxShow(false);
                        }
                      }}>
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
                    {searchBoxShow && (
                      <TextInput
                        style={styles.inputStyle}
                        placeholder="Search City.."
                        value={searchCity}
                        onChangeText={text => {
                          if (text.trim().length) {
                            setSearchCity(text);
                          } else {
                            setSearchCity('');
                          }
                        }}
                        maxLength={40}
                      />
                    )}
                    {selectCity && !searchBoxShow && (
                      <TouchableOpacity
                        style={styles.seachIconContainer}
                        onPress={() => setSearchBoxShow(true)}>
                        <Image
                          source={require('../assets/food/search.png')}
                          style={styles.seachIcon}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                  {userCity?.length > 0 && (
                    <TextInputCompo
                      value={userCity}
                      inputStyle={styles.addressInputStyle}
                      textStyle={{color: colors.food_light_black2}}
                      editable={false}
                    />
                  )}

                  {selectCity && (
                    <View
                      style={{flex: 1, paddingHorizontal: 12, marginTop: 8}}>
                      <FlatList
                        data={cityData}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                      />
                    </View>
                  )}
                  {!selectCity && (
                    <View>
                      <Text style={styles.heading}>Address</Text>
                      <TextInputCompo
                        value={userAddress}
                        onChangeText={text => {
                          if (text.trim().length) {
                            setUserAddress(text);
                          } else {
                            setUserAddress('');
                          }
                        }}
                        placeholder="Enter your address"
                        inputStyle={styles.addressInputStyle}
                        textStyle={{color: colors.food_light_black2}}
                      />
                      <Text style={styles.heading}>Postal Code</Text>
                      <TextInputCompo
                        value={userPostalCode}
                        onChangeText={text => {
                          if (text.trim().length) {
                            setUserPostalCode(text);
                          } else {
                            setUserPostalCode('');
                          }
                        }}
                        placeholder="Enter postal code"
                        inputStyle={styles.addressInputStyle}
                        textStyle={{color: colors.food_light_black2}}
                        maxLength={10}
                        keyboardType="number-pad"
                      />
                      <Text style={styles.heading}>Phone Number</Text>
                      <TextInputCompo
                        value={userPhoneNumber}
                        onChangeText={text => {
                          if (text.trim().length) {
                            setUserPhoneNumber(text);
                          } else {
                            setUserPhoneNumber('');
                          }
                        }}
                        placeholder="Enter Phone Number"
                        inputStyle={styles.addressInputStyle}
                        textStyle={{color: colors.food_light_black2}}
                        maxLength={15}
                        keyboardType="phone-pad"
                      />
                    </View>
                  )}
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
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
  addressInputStyle: {
    height: 42,
    marginTop: 8,
    borderWidth: 2,
  },
  inputStyle: {
    flex: 1,
    marginLeft: 6,
    height: 30,
    borderWidth: 1,
    borderColor: colors.coffee_Dark_Brown,
    borderRadius: 26,
    paddingHorizontal: 12,
    paddingVertical: 6,
    color: colors.black,
    fontSize: 12,
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
    zIndex: 11,
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',

    marginBottom: 14,
  },
  heading: {
    fontSize: 16,
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
  addressContainer: {
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.coffee_Light_Brown,
    paddingVertical: 8,
    paddingHorizontal: 2,
  },
  addressText: {
    fontSize: 14,
    fontFamily: fontFamily.rubik_medium,
    color: colors.coffee_Dark_Brown,
  },
  seachIcon: {
    width: 14,
    height: 14,
    tintColor: colors.food_gray,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  seachIconContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.coffee_Dark_Brown,
    borderRadius: 30 / 2,
  },
});

export default ShowAddressModal;
