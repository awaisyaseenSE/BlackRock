import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Alert,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenComponent from '../components/ScreenComponent';
import {useNavigation} from '@react-navigation/native';
import colors from '../styles/colors';
import TopCompoWithHeading from '../components/TopCompoWithHeading';
import FastImage from 'react-native-fast-image';
import constants from '../constants/constants';
import {Image} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import navigationStrings from '../navigation/navigationStrings';
import TextInputWithLeftIconCompo from '../components/TextInputWithLeftIconCompo';
import fontFamily from '../styles/fontFamily';
import Video from 'react-native-video';
import MyIndicatorLoader from '../components/MyIndicatorLoader';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function PexelCollectionScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [collectionData, setCollectionData] = useState([]);
  const [collectionName, setCollectionName] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [nextPage, setNextPage] = useState('');
  const perPage = 15;

  useEffect(() => {
    getCollectionNames();
  }, []);

  const getCollectionNames = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        'https://api.pexels.com/v1/collections/featured',
        {
          headers: {
            Authorization: constants.pexelApiKey,
          },
        },
      );
      if (!response.ok) {
        setLoading(false);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data?.collections) {
        setCollectionName(data?.collections);
      } else {
        setCollectionName([]);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching pexels collection names:', error);
    }
  };

  const handleCollectionDataById = async (
    collectionID,
    call,
    retryCount = 0,
  ) => {
    // try {
    //   setLoading(true);
    //   const response = await fetch(
    //     `https://api.pexels.com/v1/collections/${collectionID}`,
    //     {
    //       headers: {
    //         Authorization: constants.pexelApiKey,
    //       },
    //     },
    //   );
    //   if (!response.ok) {
    //     setLoading(false);
    //     throw new Error(`HTTP error! Status: ${response.status}`);
    //   }
    //   const data = await response.json();
    //   if (data?.media) {
    //     setCollectionData(data?.media);
    //   } else {
    //     setCollectionData([]);
    //   }
    //   setLoading(false);
    // } catch (error) {
    //   setLoading(false);
    //   console.error('Error fetching Collection Data by ID :', error);
    // }

    if (nextPage === null) return; // If there are no more pages, don't fetch

    let url;

    if (call == 'btnCall') {
      url = `https://api.pexels.com/v1/collections/${collectionID}?per_page=${perPage}`;
    } else {
      url =
        nextPage === ''
          ? `https://api.pexels.com/v1/collections/${collectionID}?per_page=${perPage}`
          : nextPage.length > 10
          ? nextPage
          : null;
    }

    if (url === null) {
      return null;
    }

    const options = {
      method: 'GET',
      headers: {
        Authorization: constants.pexelApiKey,
      },
    };

    try {
      setLoading(true);
      const response = await fetch(url, options);

      if (response.status === 504 && retryCount < MAX_RETRY_COUNT) {
        const waitTime = retryCount * 1000; // Adjust wait time as needed
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return handleCollectionDataById(collectionID, retryCount + 1);
      }

      if (!response.ok) {
        setLoading(false);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      if (result?.media) {
        setCollectionData(preData => [...preData, ...result?.media]);
      } else {
        setCollectionData([]);
      }
      setNextPage(result.next_page || null);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        style={styles.collectionNameContainer}
        onPress={() => {
          setCollectionData([]);
          setSelectedId(item?.id);
          handleCollectionDataById(item?.id, 'btnCall', 0);
        }}>
        <Text
          style={[
            styles.collectionNameTxt,
            {
              color: selectedId == item?.id ? colors.white : colors.gray,
            },
          ]}>
          {item?.title?.length > 14
            ? item?.title?.slice(0, 12) + '...'
            : item?.title}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderItem1 = ({item, index}) => {
    let fastImgLoad = true;
    return (
      <TouchableOpacity
        style={styles.imageStyle}
        activeOpacity={0.8}
        onPress={() => {
          if (item?.type == 'Photo') {
            navigation.navigate(navigationStrings.Detail_Photo_Screen, {
              data: item,
            });
          } else if (item?.type == 'Video') {
            navigation.navigate(navigationStrings.Show_Video_Screen, {
              link: item?.video_files[0]?.link,
            });
          } else {
            null;
          }
        }}>
        {fastImgLoad && (
          <View style={styles.loadingImageStyle}>
            <ActivityIndicator size={'small'} color={colors.gray} />
          </View>
        )}
        <FastImage
          source={{
            uri: item?.type == 'Photo' ? item?.src?.landscape : item?.image,
          }}
          style={styles.imageStyle}
          onLoadStart={() => (fastImgLoad = true)}
          onLoadEnd={() => (fastImgLoad = false)}
        />
        {item?.type == 'Video' && (
          <View style={styles.loadingImageStyle}>
            <View style={styles.videoPlayerIconConatainer}>
              <Image
                source={require('../assets/music-player.png')}
                style={styles.videoPlayerIcon}
              />
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const handleEndReached = () => {
    if (nextPage !== null && collectionData.length > 4) {
      handleCollectionDataById(selectedId);
    }
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={{alignItems: 'center', marginTop: 20}}>
        <ActivityIndicator animating size="large" color={colors.white} />
      </View>
    );
  };

  return (
    <>
      <ScreenComponent style={{backgroundColor: colors.moviesBg}}>
        <TopCompoWithHeading
          title="Pexel Collection"
          onPress={() => navigation.goBack()}
        />
        <View style={styles.container}>
          <View style={styles.collectionNameHeigt}>
            <FlatList
              data={collectionName}
              renderItem={renderItem}
              showsHorizontalScrollIndicator={false}
              horizontal
              estimatedItemSize={100}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
          <View style={styles.collectionDataContainer}>
            <FlashList
              data={collectionData}
              renderItem={renderItem1}
              keyExtractor={(item, index) => index.toString()}
              // ListFooterComponent={renderFooter}
              // onEndReached={handleEndReached}
              // onEndReachedThreshold={0.1}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => (
                <View
                  style={{height: 4, backgroundColor: colors.bottomTabBg}}
                />
              )}
              // ListHeaderComponent={renderHeader}
              estimatedItemSize={200}
              onEndReached={handleEndReached}
              onEndReachedThreshold={0.1}
              ListFooterComponent={renderFooter}
            />
          </View>
        </View>
      </ScreenComponent>
      {/* <MyIndicatorLoader visible={loading} /> */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  collectionNameHeigt: {
    height: 40,
    justifyContent: 'center',
    paddingLeft: 12,
  },
  collectionNameContainer: {
    backgroundColor: colors.black,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginRight: 12,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  collectionNameTxt: {
    fontSize: 14,
    color: colors.gray,
    fontFamily: fontFamily.rubik_semi_bold,
  },
  collectionDataContainer: {
    flex: 1,
  },
  imageStyle: {
    width: screenWidth,
    height: screenHeight * 0.26,
  },
  loadingImageStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlayerIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: colors.white,
  },
  videoPlayerIconConatainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});