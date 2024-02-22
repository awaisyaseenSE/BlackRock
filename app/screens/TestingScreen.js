import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import ScreenComponent from '../components/ScreenComponent';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';

export default function TestingScreen() {
  const data = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    ref?.current?.scrollToIndex({
      index: selectedIndex,
      animated: true,
    });
  }, [selectedIndex]);

  return (
    <>
      <ScreenComponent style={{backgroundColor: colors.moviesBg}}>
        <View style={styles.flatlistOneConatiner}>
          <FlatList
            data={data}
            ref={ref}
            renderItem={({item, index}) => (
              <View
                style={[
                  styles.flatlistOneContent,
                  {
                    backgroundColor:
                      selectedIndex == index ? colors.black : 'transparent',
                  },
                ]}>
                <Text style={styles.text}>{item}</Text>
              </View>
            )}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            initialScrollIndex={selectedIndex}
          />
        </View>
        <View style={styles.container}>
          <FlatList
            data={data}
            renderItem={({item, index}) => (
              <TouchableOpacity
                style={styles.itemsContainer}
                onPress={() => setSelectedIndex(index)}>
                <Text style={styles.text}>{item}</Text>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            onScroll={event => {
              let ind = event.nativeEvent.contentOffset.y / 50;
              let finalIndex = ind.toFixed(0);
              setSelectedIndex(
                finalIndex < 0 ? 0 : finalIndex > 19 ? 19 : finalIndex,
              );
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
  },
  text: {
    fontSize: 12,
    color: colors.lineColor,
    fontFamily: fontFamily.rubik_semi_bold,
  },
  itemsContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.gray,
    marginBottom: 20,
  },
  flatlistOneConatiner: {
    height: 30,
    marginBottom: 26,
    marginTop: 12,
  },
  flatlistOneContent: {
    marginRight: 18,
    paddingHorizontal: 22,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.lightBlack,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
