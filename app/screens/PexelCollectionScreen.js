import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Alert,
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

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function PexelCollectionScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [collectionData, setCollectionData] = useState([]);
  const [nextPage, setNextPage] = useState('');
  const perPage = 15;
  return (
    <>
      <ScreenComponent style={{backgroundColor: colors.moviesBg}}>
        <TopCompoWithHeading
          title="Pexel Collection"
          onPress={() => navigation.goBack()}
        />
        <View>
          <Text>PexelCollectionScreen</Text>
        </View>
      </ScreenComponent>
    </>
  );
}
