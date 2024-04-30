import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
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

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function WorkOutHomeScreen() {
  const navigation = useNavigation();
  return (
    <>
      <ScreenComponent
        style={{backgroundColor: colors.LightWhite}}
        content={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}>
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <View style={styles.topContainer}>
              <Text style={styles.heading}>
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
              <Text style={styles.heading2}>Exercises</Text>
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
    fontSize: 26,
    color: colors.black,
    textTransform: 'uppercase',
    fontFamily: fontFamily.rubik_medium,
  },
  userImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  heading2: {
    fontSize: 20,
    color: colors.food_light_black2,
    textTransform: 'capitalize',
    fontFamily: fontFamily.rubik_medium,
    marginBottom: 8,
  },
});
