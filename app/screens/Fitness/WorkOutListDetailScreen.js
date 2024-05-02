import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import fontFamily from '../../styles/fontFamily';
import colors from '../../styles/colors';
import FastImage from 'react-native-fast-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import WorkOutDetailModal from './components/WorkOutDetailModal';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function WorkOutListDetailScreen({route}) {
  const navigation = useNavigation();
  const data = route?.params?.data;
  const [loading, setLoading] = useState(false);
  const [fullData, setFullData] = useState([]);
  const insets = useSafeAreaInsets();
  const [showModal, setShowModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const getWorkOutDetail = async () => {
    setLoading(true);
    let url =
      data?.target === 'targetList'
        ? `https://exercisedb.p.rapidapi.com/exercises/target/${data?.name}`
        : `https://exercisedb.p.rapidapi.com/exercises/equipment/${data?.name}`;
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '5f75410f4emshf143142155a6dd7p101489jsn46223137d60a',
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
      },
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      if (result) {
        setFullData(result);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('Error while getting body patts data: ', error);
    }
  };

  useEffect(() => {
    if (data) {
      getWorkOutDetail();
    }
  }, [data]);

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.flatlistItemContainer}
        onPress={() => {
          setSelectedData(item);
          setShowModal(true);
        }}>
        <FastImage
          source={{uri: item?.gifUrl}}
          style={styles.img}
          defaultSource={require('../../assets/food/picture.png')}
        />
        <Text numberOfLines={1} style={styles.subHeading}>
          {item?.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <View style={styles.conatiner}>
        <StatusBar backgroundColor={colors.black} barStyle={'light-content'} />
        <FastImage
          source={{
            uri: data?.image
              ? data?.image
              : 'https://cdn.pixabay.com/photo/2024/04/19/16/56/ai-generated-8706774_1280.jpg',
          }}
          style={styles.imageStyle}
        />
        <View
          style={[
            styles.topContainer,
            {
              top: Platform.OS === 'ios' ? insets.top : 12,
            },
          ]}>
          <TouchableOpacity
            style={styles.backContainer}
            onPress={() => navigation.goBack()}>
            <Image
              source={require('../../assets/backward.png')}
              style={styles.backIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.mainContainer}>
          <Text style={styles.heading}>{data?.name} Exercises</Text>
          <FlatList
            data={fullData}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 16, paddingTop: 20}}
            columnWrapperStyle={{
              justifyContent: 'space-between',
            }}
            ListEmptyComponent={
              loading && (
                <ActivityIndicator size={'large'} color={colors.dark_Red} />
              )
            }
          />
        </View>
      </View>
      {showModal && (
        <WorkOutDetailModal
          showModal={showModal}
          setShowModal={setShowModal}
          data={selectedData}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    backgroundColor: colors.food_gray,
  },
  flatlistItemContainer: {
    width: screenWidth / 2 - 20,
    height: screenHeight / 4,
    marginBottom: 12,
  },
  img: {
    width: '100%',
    height: screenHeight / 4 - 30,
    borderRadius: 16,
    marginBottom: 8,
  },
  imageStyle: {
    width: screenWidth,
    height: screenHeight / 3,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  backContainer: {
    width: 34,
    height: 34,
    borderRadius: 34 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dark_Red,
  },
  backIcon: {
    width: 14,
    height: 14,
    tintColor: colors.LightWhite,
  },
  topContainer: {
    position: 'absolute',
    top: 20,
    width: '100%',
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 18,
    fontFamily: fontFamily.rubik_medium,
    color: colors.black,
    textTransform: 'capitalize',
    marginBottom: 12,
  },
  subHeading: {
    fontSize: 12,
    fontFamily: fontFamily.rubik_medium,
    color: colors.black,
    width: '90%',
    alignSelf: 'center',
    textTransform: 'capitalize',
  },
  mainContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
    flex: 1,
  },
});
