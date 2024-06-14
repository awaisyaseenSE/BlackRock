import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Platform,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import ButtonComponent from '../../components/ButtonComponent';
import ScreenComponent from '../../components/ScreenComponent';
import TextInputCompo from '../../components/TextInputCompo';
import colors from '../../styles/colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import fontFamily from '../../styles/fontFamily';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../../navigation/navigationStrings';
import ShowSpaceCompo from './ShowSpaceCompo';

const {width, height} = Dimensions.get('window');

export default function SpaceHomeScreen() {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categoryData = [
    {
      id: 0,
      title: 'All',
    },
    {
      id: 1,
      title: 'Planets',
    },
    {
      id: 2,
      title: 'Stars',
    },
    {
      id: 3,
      title: 'Galaxies',
    },
    {
      id: 4,
      title: 'Nebulas',
    },
    {
      id: 5,
      title: 'Moons',
    },
    {
      id: 6,
      title: 'Comets',
    },
    {
      id: 7,
      title: 'Black Holes',
    },
    {
      id: 8,
      title: 'Asteroids',
    },
    {
      id: 9,
      title: 'Constellations',
    },
    {
      id: 10,
      title: 'Exoplanets',
    },
    {
      id: 11,
      title: 'Meteor Showers',
    },
  ];

  const cardData = [
    {
      id: 0,
      title: 'Mother Earth',
      desc: 'Earth is the third largest planet from the sun and the only known planet to support life. It has a diameter of 12,742 km.',
      img: require('../../assets/space/earth.png'),
      bg: '#B6F3FF',
      shadow: 'rgba(132, 207, 224, 0.2)',
      dark: '#1D99B5',
    },
    {
      id: 1,
      title: 'Venus',
      desc: 'Venus is the second largest planet from the sun and is often referred to as the Earth sister planet.',
      img: require('../../assets/space/venus.png'),
      bg: '#F7D0A3',
      shadow: 'rgba(247, 208, 163, 0.2)',
      dark: '#D6711F',
    },
    {
      id: 2,
      title: 'Mars',
      desc: 'Venus is the second largest planet from the sun and is often referred to as the Earth sister planet.',
      img: require('../../assets/space/mars.png'),
      bg: '#D3A567',
      shadow: 'rgba(255, 226, 166, 0.2)',
      dark: '#FE8732',
    },
    {
      id: 3,
      title: 'Saturn',
      desc: 'Saturn is often referred to as the "jewel of the solar system" due to its stunning rings that are visible from Earth.',
      img: require('../../assets/space/saturn.png'),
      bg: '#A7C67D',
      shadow: 'rgba(161, 191, 122, 0.2)',
      dark: '#7A974A',
    },
    {
      id: 4,
      title: 'Jupiter',
      desc: 'Saturn is often referred to as the "jewel of the solar system" due to its stunning rings that are visible from Earth.',
      img: require('../../assets/space/jupiter-1.png'),
      bg: '#EFC070',
      shadow: 'rgba(249, 160, 101, 0.3)',
      dark: '#F9911D',
    },
  ];

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        style={[
          styles.labelContainer,
          {
            marginLeft: index === 0 ? 20 : 0,
            backgroundColor:
              item?.title == selectedCategory ? colors.offWhite : null,
          },
        ]}
        onPress={() => setSelectedCategory(item?.title)}>
        <Text
          style={[
            styles.label,
            {
              color:
                item?.title == selectedCategory
                  ? colors.black
                  : colors.space_gray_light,
            },
          ]}>
          {item?.title}
        </Text>
      </TouchableOpacity>
    );
  };

  const generateStars = (numStars = 16) => {
    let stars = [];
    for (let i = 0; i < numStars; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      stars.push({x, y});
    }
    return stars;
  };

  const stars = generateStars();

  return (
    <>
      <ScreenComponent style={{backgroundColor: colors.space_Black}}>
        <View style={styles.container}>
          <TextInputCompo
            placeholder="Search for planets and stars"
            inputStyle={styles.input}
            leftIcon={true}
            value={searchText}
            onChangeText={text => {
              if (text.trim().length) {
                setSearchText(text);
              } else {
                setSearchText('');
              }
            }}
            maxLength={40}
            clearIcon={searchText.length > 0 ? 'Clear' : ''}
            onPressClear={() => setSearchText('')}
          />
          <View style={{marginBottom: 14}}>
            <FlatList
              data={categoryData}
              renderItem={renderItem}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              horizontal
            />
          </View>
          <View style={{flex: 1}}>
            <View style={{marginTop: 20}}>
              <FlatList
                data={cardData}
                renderItem={({item, index}) => (
                  <ShowSpaceCompo data={item} index={index} />
                )}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                horizontal
              />
            </View>

            {stars &&
              stars.map((star, index) => (
                <Image
                  key={index}
                  source={require('../../assets/space/star.png')}
                  style={{
                    position: 'absolute',
                    left: star.x,
                    top: star.y,
                    width: index % 2 == 0 ? 8 : 4,
                    height: index % 2 == 0 ? 8 : 4,
                    zIndex: 20,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: 100,
                  }}
                  resizeMode="contain"
                />
              ))}
          </View>
        </View>
      </ScreenComponent>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    backgroundColor: colors.space_black2,
    borderWidth: 0.2,
    alignSelf: 'center',
    marginHorizontal: 20,
    marginBottom: 30,
    marginTop: 20,
  },
  label: {
    color: colors.space_gray_light,
    fontSize: 14,
    fontFamily: fontFamily.rubik_medium,
  },
  labelContainer: {
    borderWidth: 1,
    borderColor: colors.space_gray_light,
    marginRight: 14,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
});
