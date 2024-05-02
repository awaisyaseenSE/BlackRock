import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import fontFamily from '../../styles/fontFamily';
import colors from '../../styles/colors';
import ScreenComponent from '../../components/ScreenComponent';
import Carousel, {ParallaxImage} from 'react-native-snap-carousel';
import FastImage from 'react-native-fast-image';
import auth from '@react-native-firebase/auth';
import {bodyParts, sliderImgsData} from './components/workOutData';
import BodyPartCard from './components/BodyPartCard';
import {ScrollView} from 'react-native';
import navigationStrings from '../../navigation/navigationStrings';
import OptionModal from './components/OptionModal';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function WorkOutHomeScreen() {
  const navigation = useNavigation();
  const ref = useRef(null);
  const [position, setPosition] = useState({x: 0, y: 0});
  const [optionModal, setOptionModal] = useState(false);

  const handleOnPressOptionModal = event => {
    ref.current.measure((x, y, width, height, pageX, pageY) => {
      setPosition({x: pageX, y: pageY});
    });
    setOptionModal(!optionModal);
  };
  return (
    <>
      <ScreenComponent
        style={{backgroundColor: colors.LightWhite}}
        content={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}>
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <View style={styles.topContainer}>
              <Text style={styles.myheading}>
                Ready to{'\n'}
                <Text style={{color: colors.dark_Red}}>Workout</Text>
              </Text>
              <FastImage
                source={{uri: auth()?.currentUser?.photoURL}}
                defaultSource={require('../../assets/avatar.png')}
                style={styles.userImage}
              />
            </View>
            <View>
              <Carousel
                data={sliderImgsData}
                loop={true}
                autoplay={true}
                renderItem={itemCard}
                hasParallaxImages={true}
                sliderWidth={screenWidth}
                firstItem={1}
                autoplayInterval={4000}
                itemWidth={screenWidth - 80}
                slideStyle={{display: 'flex', alignItems: 'center'}}
              />
            </View>
            <View style={{flex: 1, marginTop: 20, paddingHorizontal: 16}}>
              <View style={styles.row}>
                <Text style={styles.heading2}>Exercises</Text>
                <TouchableOpacity
                  activeOpacity={0.6}
                  ref={ref}
                  onPress={handleOnPressOptionModal}>
                  <Image
                    source={require('../../assets/more.png')}
                    style={styles.optionIcon}
                  />
                </TouchableOpacity>
              </View>
              <FlatList
                data={bodyParts}
                renderItem={({item, index}) => (
                  <BodyPartCard index={index} item={item} />
                )}
                numColumns={2}
                keyExtractor={item => item.name}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 12, paddingTop: 20}}
                columnWrapperStyle={{
                  justifyContent: 'space-between',
                }}
                scrollEnabled={false}
              />
            </View>
            {optionModal && (
              <TouchableOpacity
                style={[
                  styles.optionModalStyle,
                  {
                    top: position.x + 20,
                  },
                ]}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate(navigationStrings.Workout_List_Screen, {
                      name: 'equipmentList',
                    });
                    setOptionModal(!optionModal);
                  }}>
                  <Text style={styles.heading}>Equipment List</Text>
                </TouchableOpacity>
                <View style={{marginVertical: 6}} />
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate(navigationStrings.Workout_List_Screen, {
                      name: 'targetList',
                    });
                    setOptionModal(!optionModal);
                  }}>
                  <Text style={styles.heading}>Target List</Text>
                </TouchableOpacity>
                <View style={{marginVertical: 6}} />
                <TouchableOpacity>
                  <Text style={styles.heading}>Best Exercises</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </ScreenComponent>
    </>
  );
}

const itemCard = ({item, index}, parallaxProps) => {
  return (
    <View
      style={{
        width: screenWidth - 80,
        height: screenHeight / 4,
      }}>
      <ParallaxImage
        source={item}
        containerStyle={{borderRadius: 30, flex: 1}}
        parallaxFactor={1}
        style={{resizeMode: 'contain'}}
        {...parallaxProps}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topContainer: {
    paddingHorizontal: 20,
    marginTop: 14,
    marginBottom: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heading: {
    fontSize: 30,
    color: colors.black,
    textTransform: 'uppercase',
    fontFamily: fontFamily.rubik_medium,
    marginBottom: 16,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  heading2: {
    fontSize: 20,
    color: colors.food_light_black2,
    textTransform: 'capitalize',
    fontFamily: fontFamily.rubik_medium,
    marginBottom: 8,
  },
  optionIcon: {
    width: 24,
    height: 24,
    tintColor: colors.black,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionModalStyle: {
    backgroundColor: colors.white,
    right: 10,
    position: 'absolute',
    zIndex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.food_gray,
    minWidth: screenWidth / 2,
    minHeight: screenHeight / 8,
  },
  heading: {
    fontSize: 14,
    color: colors.black,
    fontFamily: fontFamily.rubik_medium,
  },
  myheading: {
    fontSize: 24,
    color: colors.black,
    textTransform: 'uppercase',
    fontFamily: fontFamily.rubik_medium,
    lineHeight: 34,
  },
});
