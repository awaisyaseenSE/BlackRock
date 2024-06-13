import {
  View,
  Text,
  StyleSheet,
  Modal,
  Platform,
  TouchableOpacity,
  Image,
  ImageBackground,
  FlatList,
} from 'react-native';
import React from 'react';
import ScreenComponent from '../../../components/ScreenComponent';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import colors from '../../../styles/colors';
import fontFamily from '../../../styles/fontFamily';
import LinearGradient from 'react-native-linear-gradient';

const ShowInvestDetailModal = ({show, setShow, data}) => {
  const insets = useSafeAreaInsets();
  const histroyData = [
    {
      id: 0,
      title: 'Buy APPL Stock',
      time: 'TUE 22 Jun 2020',
      price: 'Rp 200.00',
    },
    {
      id: 1,
      title: 'Buy TLKM Stock',
      time: 'SUN 20 Jun 2020',
      price: 'Rp 150.00',
    },
    {
      id: 2,
      title: 'Buy FB Stock',
      time: 'SAT 19 Jun 2020',
      price: 'Rp 220.00',
    },
    {
      id: 3,
      title: 'Buy TESLA Stock',
      time: 'THU 17 Jun 2020',
      price: 'Rp 300.00',
    },
    {
      id: 0,
      title: 'Buy APPL Stock',
      time: 'TUE 22 Jun 2020',
      price: 'Rp 200.00',
    },
    {
      id: 1,
      title: 'Buy TLKM Stock',
      time: 'SUN 20 Jun 2020',
      price: 'Rp 150.00',
    },
    {
      id: 2,
      title: 'Buy FB Stock',
      time: 'SAT 19 Jun 2020',
      price: 'Rp 220.00',
    },
    {
      id: 3,
      title: 'Buy TESLA Stock',
      time: 'THU 17 Jun 2020',
      price: 'Rp 300.00',
    },
  ];

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity style={styles.flatlistView}>
        <Text
          style={[
            styles.h2,
            {
              color: colors.invest_green,
            },
          ]}>
          {item?.price}
        </Text>
        <View style={styles.row2}>
          <Text style={[styles.lightTxt]}>{item?.title}</Text>
          <Text style={styles.lightTxt}>{item?.time}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Modal visible={show} transparent animationType="slide">
        <View
          style={[
            styles.container,
            {
              paddingTop: Platform.OS === 'ios' ? insets.top : 10,
            },
          ]}>
          <TouchableOpacity
            style={{height: 50}}
            activeOpacity={1}
            onPress={() => setShow(false)}
          />
          <View style={styles.mainContainer}>
            <View style={styles.row}>
              <View
                style={{
                  width: '12%',
                }}
              />
              <Text style={styles.heading}>My Assest</Text>
              <View
                style={{
                  width: '12%',
                  alignItems: 'flex-end',
                }}>
                <TouchableOpacity
                  style={styles.closeIconContainer}
                  onPress={() => setShow(false)}>
                  <Image
                    source={require('../../../assets/close.png')}
                    style={styles.closeIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.subHeading}>Your total asset portfolio</Text>
            <Text
              style={[
                styles.heading,
                {marginTop: 8, fontSize: 24, color: colors.food_light_black2},
              ]}>
              N203,935
            </Text>
            <View style={{marginTop: 30}}>
              <Text style={styles.h2}>Current Plans</Text>
              <View style={styles.coinCard}>
                <LinearGradient
                  style={{
                    borderRadius: 16,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                  start={{x: 0, y: 0}}
                  end={{x: 0.4, y: 1}}
                  colors={data?.colors}>
                  <View style={styles.coinCardView}>
                    <Text style={styles.coinh1}>{data?.title}</Text>
                    <Text style={styles.coinh3}>{data?.subTitle}</Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'flex-end',
                    }}>
                    <ImageBackground source={data?.img} style={styles.coinImg}>
                      <View
                        style={{
                          flex: 1,
                          backgroundColor: data?.backgroundColor,
                          opacity: data?.opacity,
                          borderRadius: 100,
                        }}></View>
                    </ImageBackground>
                  </View>
                </LinearGradient>
              </View>
              <View style={styles.allPlansContainer}>
                <TouchableOpacity style={styles.row1}>
                  <Text style={styles.txt}>See All Plans</Text>
                  <Image
                    source={require('../../../assets/invest/right-arrow.png')}
                    style={styles.arrowIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.h1}>Histroy</Text>
            <View
              style={{
                flex: 1,
                marginBottom: Platform.OS === 'ios' ? insets.bottom : 20,
              }}>
              <FlatList
                data={histroyData}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                  <View
                    style={{height: Platform.OS === 'ios' ? insets.bottom : 14}}
                  />
                }
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  mainContainer: {
    backgroundColor: colors.offWhite,
    flex: 1,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 20,
  },
  closeIcon: {
    width: 10,
    height: 10,
    tintColor: colors.white,
  },
  closeIconContainer: {
    width: 24,
    height: 24,
    backgroundColor: colors.grey,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 22,
    marginBottom: 16,
  },
  heading: {
    fontSize: 18,
    color: colors.black,
    fontFamily: fontFamily.rubik_semi_bold,
  },
  subHeading: {
    fontSize: 12,
    color: colors.gray,
    fontFamily: fontFamily.rubik_medium,
  },
  h2: {
    fontSize: 16,
    color: colors.black,
    fontFamily: fontFamily.rubik_semi_bold,
  },

  // coin card
  coinCard: {
    width: '100%',
    height: 150,
    borderRadius: 18,
    alignSelf: 'center',
    marginTop: 20,
    overflow: 'hidden',
  },
  coinCardView: {
    paddingHorizontal: 22,
    marginTop: 14,
  },
  img: {
    width: 70,
    height: 70,
    borderRadius: 35,
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
    height: 160,
    width: 180,
    marginTop: 2,
    overflow: 'hidden',
    marginRight: -6,
  },
  allPlansContainer: {
    marginTop: 14,
    marginBottom: 14,
    alignItems: 'center',
  },
  arrowIcon: {
    width: 18,
    height: 18,
    tintColor: colors.lightRed,
    marginLeft: 2,
  },
  txt: {
    fontSize: 14,
    color: colors.lightRed,
    fontFamily: fontFamily.rubik_medium,
  },
  row1: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  h1: {
    fontSize: 18,
    color: colors.black,
    fontFamily: fontFamily.rubik_medium,
    marginBottom: 16,
  },
  lightTxt: {
    fontSize: 12,
    color: colors.gray,
    fontFamily: fontFamily.rubik_medium,
  },
  row2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 4,
  },
  flatlistView: {
    marginBottom: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.gray,
    paddingBottom: 8,
  },
});

export default ShowInvestDetailModal;
