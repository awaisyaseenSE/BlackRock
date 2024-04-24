import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import colors from '../styles/colors';
import {FlashList} from '@shopify/flash-list';
import fontFamily from '../styles/fontFamily';
import TopCompoWithHeading from '../components/TopCompoWithHeading';
import ScreenComponent from '../components/ScreenComponent';
import {useNavigation} from '@react-navigation/native';
import Timeline from 'react-native-timeline-flatlist';
import ButtonComponent from '../components/ButtonComponent';

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

  const timelineData = [
    {time: '09:00', title: 'Event 1', description: 'Event 1 Description'},
    {time: '10:45', title: 'Event 2', description: 'Event 2 Description'},
    {time: '12:00', title: 'Event 3', description: 'Event 3 Description'},
    {time: '14:00', title: 'Event 4', description: 'Event 4 Description'},
    {time: '16:30', title: 'Event 5', description: 'Event 5 Description'},
  ];

  return (
    <>
      <ScreenComponent style={{backgroundColor: colors.moviesBg}}>
        <TopCompoWithHeading
          title="Flahlist"
          onPress={() => navigation.goBack()}
        />
        <View style={styles.container}>
          <Timeline
            circleSize={20}
            separator={true}
            circleColor={colors.black}
            lineColor={colors.gray}
            lineWidth={3}
            data={timelineData}
            descriptionStyle={styles.descriptionStyle}
            timeContainerStyle={styles.timeContainerStyle}
            timeStyle={styles.timeStyle}
            circleStyle={styles.circleStyle}
            titleStyle={styles.titleStyle}
          />
          <Text
            style={{
              color: colors.gray,
              fontSize: 24,
              marginBottom: 20,
              fontWeight: '800',
              marginTop: 12,
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
  descriptionStyle: {
    color: colors.white,
  },
  timeContainerStyle: {
    backgroundColor: colors.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 90,
    borderRadius: 30,
  },
  timeStyle: {
    color: colors.black,
    fontWeight: 'bold',
    fontSize: 20,
  },
  titleStyle: {
    color: colors.gray,
    fontSize: 23,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.whiteOpacity70,
    marginVertical: 20,
  },
});
