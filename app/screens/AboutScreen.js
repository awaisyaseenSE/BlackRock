import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenComponent from '../components/ScreenComponent';
import {useNavigation} from '@react-navigation/native';
import colors from '../styles/colors';
import TopCompoWithHeading from '../components/TopCompoWithHeading';
import ButtonComponent from '../components/ButtonComponent';
import navigationStrings from '../navigation/navigationStrings';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import FastImage from 'react-native-fast-image';
import LoadingComponent from '../components/LoadingComponent';

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

  if (loading) {
    return <LoadingComponent />;
  }

  const renderItem = ({item}) => {
    return (
      <View style={{marginVertical: 10}}>
        <FlatList
          data={item?.imagesUrls}
          renderItem={({item}) => (
            <FastImage source={{uri: item}} style={styles.image} />
          )}
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
      <ScreenComponent style={{backgroundColor: colors.moviesBg}}>
        <View style={styles.container}>
          <TopCompoWithHeading
            title="About"
            onPress={() => navigation.goBack()}
          />
          <View style={{marginTop: 4}} />
          <FlatList
            data={imagesData}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScreenComponent>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 20,
    color: colors.lightBlack,
  },
  btn: {
    width: '60%',
    marginTop: 20,
    alignSelf: 'center',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 10,
  },
});
