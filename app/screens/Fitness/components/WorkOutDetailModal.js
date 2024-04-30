import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import React from 'react';
import colors from '../../../styles/colors';
import fontFamily from '../../../styles/fontFamily';
import FastImage from 'react-native-fast-image';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const WorkOutDetailModal = ({showModal = false, setShowModal, data}) => {
  return (
    <Modal visible={showModal} transparent animationType="slide">
      <View style={styles.topContainer}>
        <TouchableOpacity
          style={{flex: 1}}
          onPress={() => setShowModal(false)}
        />
        <View style={styles.container}>
          <View style={{flex: 1}}>
            <TouchableOpacity
              style={styles.checkIconContainer}
              activeOpacity={0.6}
              onPress={() => setShowModal(false)}>
              <Image
                source={require('../../../assets/close.png')}
                style={styles.checkIconStyle}
              />
            </TouchableOpacity>
            <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
              <View style={{flex: 1}}>
                <FastImage source={{uri: data?.gifUrl}} style={styles.image} />
                <View
                  style={{
                    paddingHorizontal: 16,
                    marginTop: 20,
                    paddingBottom: 20,
                  }}>
                  <Text style={styles.heading}>{data?.name} </Text>
                  <Text style={styles.grayText}>
                    Equipment{'  '}
                    <Text style={{color: colors.black}}>{data?.equipment}</Text>
                  </Text>
                  <Text style={styles.grayText}>
                    secondaryMuscles{'  '}
                    {data?.secondaryMuscles?.map((muscle, index, array) => (
                      <Text key={index} style={{color: colors.black}}>
                        {index === array.length - 1
                          ? muscle + '.'
                          : muscle + ', '}
                      </Text>
                    ))}
                  </Text>
                  <Text style={styles.grayText}>
                    target{'  '}
                    <Text style={{color: colors.black}}>{data?.target}</Text>
                  </Text>
                  <Text style={styles.heading}>Instructions</Text>
                  {data?.instructions?.map((muscle, index, array) => (
                    <View key={index} style={styles.row}>
                      <View
                        style={{
                          height: '100%',
                          paddingTop: 4,
                        }}>
                        <View style={styles.dot} />
                      </View>
                      <View style={{marginHorizontal: 4}} />
                      <Text style={styles.txt}>{muscle}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: screenHeight / 1.2,
    backgroundColor: colors.food_gray,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  topContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  checkIconContainer: {
    width: 32,
    height: 32,
    backgroundColor: colors.dark_Red,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    position: 'absolute',
    top: 10,
    zIndex: 1,
    right: 8,
  },
  checkIconStyle: {
    width: 12,
    height: 12,
    tintColor: colors.LightWhite,
  },
  heading: {
    fontSize: 18,
    color: colors.black,
    fontFamily: fontFamily.rubik_medium,
    textTransform: 'capitalize',
    marginBottom: 10,
  },
  grayText: {
    fontSize: 14,
    fontFamily: fontFamily.rubik_medium,
    color: colors.food_light_black2,
    textTransform: 'capitalize',
    marginBottom: 12,
  },
  txt: {
    fontSize: 14,
    fontFamily: fontFamily.rubik_medium,
    color: colors.food_light_black2,
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: colors.food_light_black2,
    borderRadius: 4,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'flex-start',
  },
  image: {
    width: '100%',
    height: screenHeight / 3,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
});

export default WorkOutDetailModal;
