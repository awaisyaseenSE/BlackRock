import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import ScreenComponent from '../components/ScreenComponent';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import ButtonComponent from '../components/ButtonComponent';

export default function TestingScreen() {
  const [loading, setLoading] = useState(false);
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

  const handleFetchMemesData = async () => {
    const url =
      'https://ronreiter-meme-generator.p.rapidapi.com/meme?top=Top%20Text&bottom=Bottom%20Text&meme=Condescending-Wonka&font_size=50&font=Impact';
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '002c32715dmshd97fa28dbb46d29p102420jsnfddbf1201a7d',
        'X-RapidAPI-Host': 'ronreiter-meme-generator.p.rapidapi.com',
      },
    };

    try {
      const response = await fetch(url, options);
      const result = await response.text();
      console.log('...............START................');
      console.log(result);
      console.log('...............END................');
    } catch (error) {
      console.error(error);
    }
  };

  // const handleFetchMovieData = async () => {
  //   const url =
  //     'https://moviesminidatabase.p.rapidapi.com/movie/order/upcoming/';
  //   const options = {
  //     method: 'GET',
  //     headers: {
  //       'X-RapidAPI-Key': '002c32715dmshd97fa28dbb46d29p102420jsnfddbf1201a7d',
  //       'X-RapidAPI-Host': 'moviesminidatabase.p.rapidapi.com',
  //     },
  //   };

  //   try {
  //     const response = await fetch(url, options);
  //     const result = await response.text();
  //     console.log(result);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const getMovieByYear = async () => {
    const url = 'https://moviesminidatabase.p.rapidapi.com/movie/byYear/2020/';
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '002c32715dmshd97fa28dbb46d29p102420jsnfddbf1201a7d',
        'X-RapidAPI-Host': 'moviesminidatabase.p.rapidapi.com',
      },
    };

    try {
      const response = await fetch(url, options);
      const result = await response.text();
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <ScreenComponent style={{backgroundColor: colors.moviesBg}}>
        <ButtonComponent
          title="get data"
          style={{marginVertical: 20, width: '50%', alignSelf: 'center'}}
          onPress={getMovieByYear}
          loading={loading}
        />
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
