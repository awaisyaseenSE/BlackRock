import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import colors from '../styles/colors';
import {FlashList} from '@shopify/flash-list';
import fontFamily from '../styles/fontFamily';
import TopCompoWithHeading from '../components/TopCompoWithHeading';
import ScreenComponent from '../components/ScreenComponent';
import {useNavigation} from '@react-navigation/native';

export default function FlashListTestingScreen() {
  const navigation = useNavigation();

  const DATA_Flahlist = [
    {
      title: 'Awais Yaseen',
    },
    {
      title: 'Bilal Shan',
    },
    {
      title: 'Ahmed Ali',
    },
    {
      title: 'Sikandar Ali',
    },
  ];
  const MyList = () => {
    return (
      <FlashList
        data={DATA_Flahlist}
        renderItem={({item}) => (
          <Text
            style={{
              color: colors.gray,
              fontSize: 18,
              fontFamily: fontFamily.lato_bold,
              marginBottom: 8,
            }}>
            {item.title}
          </Text>
        )}
        estimatedItemSize={200}
      />
    );
  };
  return (
    <>
      <ScreenComponent style={{backgroundColor: colors.moviesBg}}>
        <TopCompoWithHeading
          title="Flahlist"
          onPress={() => navigation.goBack()}
        />
        <View style={styles.container}>
          <Text
            style={{
              color: colors.gray,
              fontSize: 24,
              marginBottom: 20,
              fontWeight: '800',
            }}>
            FlashList Testing Screen
          </Text>
          <MyList />
        </View>
      </ScreenComponent>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 18,
  },
});
