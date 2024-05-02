import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  FlatList,
  Dimensions,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import ScreenComponent from '../../components/ScreenComponent';
import colors from '../../styles/colors';
import {equipmentList, targetList} from './components/workOutData';
import FastImage from 'react-native-fast-image';
import fontFamily from '../../styles/fontFamily';
import LinearGradient from 'react-native-linear-gradient';
import navigationStrings from '../../navigation/navigationStrings';
import {useNavigation} from '@react-navigation/native';
import TopCompoWithHeading from '../../components/TopCompoWithHeading';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function WorkoutListScreen({route}) {
  const name = route?.params?.name;
  const navigation = useNavigation();

  const renderItem = ({item}) => {
    let dummyImageUrl =
      name === 'targetList'
        ? 'https://cdn.pixabay.com/photo/2024/04/19/16/56/ai-generated-8706775_1280.jpg'
        : 'https://i.pinimg.com/736x/91/fd/14/91fd14f30437ebbe5eff86a5a39f269b.jpg';

    let finalData = {...item, target: name};
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        style={styles.imageContainer}
        onPress={() =>
          navigation.navigate(navigationStrings.Work_Out_List_Detail_Screen, {
            data: finalData,
          })
        }>
        <FastImage
          source={{
            uri: item?.image ? item?.image : dummyImageUrl,
          }}
          defaultSource={require('../../assets/food/picture.png')}
          style={styles.imageStyle}
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

  return (
    <>
      <ScreenComponent
        style={{backgroundColor: colors.LightWhite}}
        content={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}>
        <TopCompoWithHeading
          title={name + ' Exercises'}
          titleStyle={styles.titleStyle}
          backIconStyle={{tintColor: colors.black}}
          onPress={() => navigation.goBack()}
        />
        <View style={styles.container}>
          <FlatList
            data={name === 'targetList' ? targetList : equipmentList}
            renderItem={renderItem}
            keyExtractor={item => item.name}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            contentContainerStyle={{paddingBottom: 12, paddingTop: 20}}
            columnWrapperStyle={{
              justifyContent: 'space-between',
            }}
          />
        </View>
      </ScreenComponent>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  imageStyle: {
    width: null,
    height: null,
    flex: 1,
    borderRadius: 12,
  },
  imageContainer: {
    width: screenWidth / 2 - 20,
    height: screenHeight / 5,
    marginBottom: 12,
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
  heading: {
    fontSize: 16,
    color: colors.LightWhite,
    textTransform: 'capitalize',
    fontFamily: fontFamily.rubik_medium,
  },
  titleStyle: {
    color: colors.black,
    textTransform: 'capitalize',
  },
});
