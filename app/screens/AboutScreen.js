import {
  View,
  StyleSheet,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  StatusBar,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenComponent from '../components/ScreenComponent';
import {useNavigation} from '@react-navigation/native';
import colors from '../styles/colors';
import TopCompoWithHeading from '../components/TopCompoWithHeading';
import firestore from '@react-native-firebase/firestore';
import FastImage from 'react-native-fast-image';
import MyIndicatorLoader from '../components/MyIndicatorLoader';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function AboutScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [imagesData, setImagesData] = useState([]);

  let isMounted = false;

  useEffect(() => {
    isMounted = true;
    getImages();
    return () => {
      isMounted = false;
    };
  }, []);

  const getImages = () => {
    try {
      setLoading(true);
      firestore()
        .collection('testingImages')
        .onSnapshot(snap => {
          const allPostData = snap.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
          }));
          setImagesData(allPostData);
        });

      setLoading(false);
    } catch (error) {
      console.log('Error in fetching images from firestore: ', error);
      setLoading(false);
    }
  };

  const renderItem = ({item}) => {
    return (
      <View style={{marginVertical: 10}}>
        <FlatList
          data={item?.imagesUrls}
          renderItem={({item}) => {
            let fastImgLoad = true;
            return (
              <View style={{width: 120, height: 120}}>
                {fastImgLoad && (
                  <View style={styles.loadingImageStyle}>
                    <ActivityIndicator size={'small'} color={colors.gray} />
                  </View>
                )}
                <FastImage
                  source={{uri: item}}
                  style={styles.image}
                  onLoadStart={() => (fastImgLoad = true)}
                  onLoadEnd={() => (fastImgLoad = false)}
                />
              </View>
            );
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={<View style={{marginVertical: 10}} />}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  };

  return (
    <>
      <StatusBar backgroundColor={colors.black} barStyle={'light-content'} />
      <ScreenComponent style={{backgroundColor: colors.moviesBg}}>
        <TopCompoWithHeading
          title="About"
          onPress={() => navigation.goBack()}
        />
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <View style={{marginTop: 4}} />

            <FlatList
              data={imagesData}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          </View>
        </ScrollView>
      </ScreenComponent>
      {/* <ImageBackground
          source={{
            uri: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          }}
          style={{flex: 1, width: null, height: null}}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{fontSize: 16, color: colors.blue}}>Your Contents</Text>
          </View>
        </ImageBackground> */}
      <MyIndicatorLoader visible={loading} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 20,
    color: colors.lightBlack,
  },
  btn: {
    width: '60%',
    marginBottom: 20,
    alignSelf: 'center',
    borderRadius: 8,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 10,
  },
  pexelsImageStyle: {
    width: screenWidth,
    height: screenHeight * 0.25,
    resizeMode: 'contain',
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
  topCompo: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
});
