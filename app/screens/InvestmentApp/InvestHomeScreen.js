import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  Dimensions,
  TouchableOpacity,
  Alert,
  ImageBackground,
  FlatList,
} from 'react-native';
import React from 'react';
import ScreenComponent from '../../components/ScreenComponent';
import colors from '../../styles/colors';
import fontFamily from '../../styles/fontFamily';
import ButtonComponent from '../../components/ButtonComponent';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../../navigation/navigationStrings';
import InvestTopCompo from './components/InvestTopCompo';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function InvestHomeScreen() {
  const coinsData = [
    {
      id: 0,
      title: 'Gold',
      colors: [colors.yellow, colors.food_yellow, colors.food_yellow],
      subTitle: '30% return',
      backgroundColor: '#D58009',
      opacity: 0.5,
      img: require('../../assets/invest/dollar.png'),
    },
    {
      id: 1,
      title: 'Silver',
      colors: ['#C1C0C0', '#AEADAD', '#999999'],
      subTitle: '60% return',
      backgroundColor: '#262626',
      opacity: 0.4,
      img: require('../../assets/invest/euro.png'),
    },
    {
      id: 2,
      title: 'Platinum',
      colors: ['#B388F2', '#8C74E5', '#6D65E4'],
      subTitle: '40% return',
      backgroundColor: '#8C74E5',
      opacity: 0.6,
      img: require('../../assets/invest/platinium.png'),
    },
    {
      id: 3,
      title: 'Ethereum',
      colors: ['#698FE3', '#6170C2', '#1694FF'],
      subTitle: '24% return',
      backgroundColor: '#627EEA',
      opacity: 0.4,
      img: require('../../assets/invest/ethereum.png'),
    },
    {
      id: 3,
      title: 'Bitcoin',
      colors: ['#F79626', '#F89228', '#D8850C'],
      subTitle: '33% return',
      backgroundColor: '#E99614',
      opacity: 0.4,
      img: require('../../assets/invest/bitcoin.png'),
    },
  ];

  const investmentData = [
    {
      id: 0,
      title: 'Basic type of investments',
      desc: 'This is how you set your foot for 2020 Stock market recession. What’s next...',
      img: 'https://cimg.co/wp-content/uploads/2024/02/19195121/1708372280-1708022860-1707747397-bitcoin-price-jumps-as-net-inflow-into-btc-spot-etfs-rises-more-crypto-news-1.jpg',
    },
    {
      id: 1,
      title: 'How much can you start wit..',
      desc: 'What do you like to see? It’s a very different market from 2018. The way...',
      img: 'https://cdn.pixabay.com/photo/2017/12/17/14/12/bitcoin-3024279_1280.jpg',
    },
    {
      id: 2,
      title: 'Where to invest in save way',
      desc: 'This is how you set your foot for 2020 Stock market recession. What’s next...',
      img: 'https://images.pexels.com/photos/210607/pexels-photo-210607.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      id: 3,
      title: 'Best currency to invest',
      desc: 'What do you like to see? It’s a very different market from 2018. The way...',
      img: 'https://images.pexels.com/photos/50987/money-card-business-credit-card-50987.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
  ];

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        style={[
          styles.coinCard,
          {
            marginLeft: index == 0 ? 20 : 0,
            marginRight: 18,
          },
        ]}
        activeOpacity={0.6}>
        <LinearGradient
          style={{borderRadius: 16}}
          start={{x: 0, y: 0}}
          end={{x: 0.4, y: 1}}
          colors={item?.colors}>
          <View style={styles.coinCardView}>
            <Text style={styles.coinh1}>{item?.title}</Text>
            <Text style={styles.coinh3}>{item?.subTitle}</Text>
          </View>
          <ImageBackground
            source={item?.img}
            style={styles.coinImg}
            resizeMode="contain">
            <View
              style={{
                flex: 1,
                backgroundColor: item?.backgroundColor,
                opacity: item?.opacity,
                borderRadius: 100,
              }}></View>
          </ImageBackground>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const investmentRenderCompo = ({item, index}) => {
    return (
      <TouchableOpacity style={styles.row1}>
        <View style={{flex: 1, marginRight: 10}}>
          <Text style={styles.titleTxt}>{item?.title}</Text>
          <Text style={[styles.titleTxt1]}>{item?.desc}</Text>
        </View>
        <View>
          <FastImage source={{uri: item?.img}} style={styles.img} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenComponent
      style={{backgroundColor: colors.invest_white}}
      content={Platform.OS === 'android' ? 'light-content' : 'dark-content'}>
      <View style={styles.container}>
        <View style={{paddingHorizontal: 20}}>
          <InvestTopCompo
            rightIcon={require('../../assets/bell.png')}
            leftIcon={require('../../assets/invest/menu.png')}
            onPress={() => {}}
          />
          <Text style={styles.heading}>Welcome, Jessie.</Text>
          <View style={styles.card}>
            <View style={{flex: 1}}>
              <Text style={styles.cardbtnTxt}>Your total asset portfolio</Text>
              <Text style={styles.cardTxt}>N203,934</Text>
            </View>
            <View style={{justifyContent: 'flex-end'}}>
              <TouchableOpacity style={styles.btn1}>
                <Text style={styles.greenTxt}>Invest now</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.h2}>Best Plans</Text>
            <TouchableOpacity style={styles.sellBtn}>
              <Text style={styles.seeAllTxt}>See All</Text>
              <Image
                source={require('../../assets/invest/right-arrow.png')}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{height: 180}}>
          <FlatList
            data={coinsData}
            renderItem={renderItem}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            horizontal
          />
        </View>
        <View style={{paddingHorizontal: 20, marginTop: 16, flex: 1}}>
          <Text style={styles.h2}>Investment guide</Text>
          <FlatList
            data={investmentData}
            renderItem={investmentRenderCompo}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            // ListFooterComponent={<View style={{height: 50}} />}
          />
        </View>
      </View>
    </ScreenComponent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: 22,
  },
  heading: {
    fontSize: 26,
    color: colors.black,
    fontFamily: fontFamily.rubik_semi_bold,
    marginTop: 12,
    marginBottom: 20,
  },
  card: {
    backgroundColor: colors.invest_green,
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 14,
    justifyContent: 'space-between',
  },
  btn: {
    width: '100%',
  },
  btn1: {
    backgroundColor: colors.white,
    paddingVertical: 10,
    borderRadius: 10,
    paddingHorizontal: 16,
  },
  greenTxt: {
    color: colors.invest_green,
    fontFamily: fontFamily.rubik_medium,
    fontSize: 14,
  },
  cardbtnTxt: {
    color: colors.LightWhite,
    fontSize: 14,
    fontFamily: fontFamily.rubik_medium,
    marginBottom: 10,
    marginTop: 8,
  },
  cardTxt: {
    fontSize: 22,
    color: colors.white,
    fontFamily: fontFamily.rubik_semi_bold,
  },
  h2: {
    fontSize: 20,
    color: colors.black,
    fontFamily: fontFamily.rubik_semi_bold,
  },
  icon: {
    width: 14,
    height: 14,
    tintColor: colors.invest_red,
    marginLeft: 4,
  },
  sellBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllTxt: {
    fontSize: 16,
    color: colors.invest_red,
    fontFamily: fontFamily.rubik_medium,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 30,
    marginBottom: 20,
  },

  // coin card style
  coinCard: {
    width: 140,
    height: 140,
    borderRadius: 18,
  },
  coinCardView: {
    paddingHorizontal: 22,
    marginTop: 18,
  },
  coinh1: {
    fontSize: 20,
    color: colors.white,
    fontFamily: fontFamily.rubik_medium,
    marginBottom: 4,
  },
  coinh3: {
    fontSize: 14,
    color: colors.whiteOpacity70,
    fontFamily: fontFamily.rubik_medium,
  },
  coinImg: {
    height: 100,
    width: 100,
    alignSelf: 'flex-end',
    marginRight: -12,
  },
  img: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  row1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: colors.grey,
    paddingBottom: 12,
    marginBottom: 20,
  },
  titleTxt: {
    color: colors.black,
    fontFamily: fontFamily.rubik_medium,
    fontSize: 16,
  },
  titleTxt1: {
    color: colors.lightBlack,
    fontFamily: fontFamily.rubik_regular,
    fontSize: 14,
    marginTop: 8,
  },
});
