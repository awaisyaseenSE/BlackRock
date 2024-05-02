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
import ScreenComponent from '../../components/ScreenComponent';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function WorkOutAllExercisesScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [fullData, setFullData] = useState([]);
  const insets = useSafeAreaInsets();
  const [showModal, setShowModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [limit, setLimit] = useState(10);
  const totalDataCount = 1400;
  const perPage = 10;

  const getAllExercises = async () => {
    setLoading(true);
    const url = `https://exercisedb.p.rapidapi.com/exercises?limit=${limit}`;
    const options = {
      method: 'GET',
      headers: {
        // 'X-RapidAPI-Key': '5f75410f4emshf143142155a6dd7p101489jsn46223137d60a',
        'X-RapidAPI-Key': '002c32715dmshd97fa28dbb46d29p102420jsnfddbf1201a7d',
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
    getAllExercises();
  }, [limit]);

  const handleLoadMore = () => {
    if (limit < totalDataCount) {
      setLimit(limit + perPage);
    }
  };

  const handleListFooterComponent = () => {
    if (loading) {
      return <ActivityIndicator size={'large'} color={colors.dark_Red} />;
    } else {
      return null;
    }
  };

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
      <ScreenComponent
        style={{backgroundColor: colors.food_gray}}
        content={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}>
        <View style={styles.conatiner}>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.backContainer}
              onPress={() => navigation.goBack()}>
              <Image
                source={require('../../assets/backward.png')}
                style={styles.backIcon}
              />
            </TouchableOpacity>
            <Text style={styles.heading}>Exercises</Text>
          </View>
          <View style={styles.mainContainer}>
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
              //   ListEmptyComponent={
              //     loading && (
              //       <ActivityIndicator size={'large'} color={colors.dark_Red} />
              //     )
              //   }
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.1}
              ListFooterComponent={handleListFooterComponent}
            />
          </View>
        </View>
      </ScreenComponent>
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
    width: 28,
    height: 28,
    borderRadius: 28 / 2,
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
    marginLeft: 12,
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
    paddingHorizontal: 16,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
});
