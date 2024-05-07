import {View, Text, Modal, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import ButtonComponent from '../../../components/ButtonComponent';
import colors from '../../../styles/colors';
import fontFamily from '../../../styles/fontFamily';
import {Platform} from 'react-native';

const WallpaperFilterModal = ({
  color,
  setColor,
  showFilterModal,
  setShowFilterModel,
  type,
  setType,
  order,
  setOrder,
}) => {
  let wallcolors = [
    'red',
    'orange',
    'yellow',
    'green',
    'turquoise',
    'blue',
    'pink',
    'white',
    'gray',
    'black',
    'brown',
  ];

  const wallType = ['all', 'photo', 'illustration', 'vector'];
  const wallorder = ['popular', 'latest'];

  const handleResetFilter = () => {
    setColor('');
    setOrder('popular');
    setType('all');
    setShowFilterModel(false);
  };
  return (
    <Modal visible={showFilterModal} transparent animationType="slide">
      <View style={{backgroundColor: 'rgba(0, 0, 0, 0.6)', flex: 1}}>
        <TouchableOpacity
          style={{flex: 0.4}}
          onPress={() => setShowFilterModel(false)}
        />
        <View style={styles.container}>
          <View style={styles.topLine} />
          <View
            style={[
              styles.mainContainer,
              {
                paddingBottom: Platform.OS === 'android' ? 20 : 30,
              },
            ]}>
            <Text style={styles.heading}>Filters</Text>
            <Text style={styles.subHeading}>Order</Text>
            <View style={[styles.flexWrap, {marginBottom: 12}]}>
              {wallorder.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.typeContainer,
                    {
                      backgroundColor:
                        order == item ? colors.food_light_black2 : null,
                    },
                  ]}
                  activeOpacity={0.7}
                  onPress={() => setOrder(item)}>
                  <Text
                    style={[
                      styles.txt,
                      {
                        color: order == item ? colors.white : colors.black,
                      },
                    ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.subHeading}>Type</Text>
            <View style={[styles.flexWrap, {marginBottom: 12}]}>
              {wallType.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.typeContainer,
                    {
                      backgroundColor:
                        type == item ? colors.food_light_black2 : null,
                    },
                  ]}
                  activeOpacity={0.7}
                  onPress={() => setType(item)}>
                  <Text
                    style={[
                      styles.txt,
                      {
                        color: type == item ? colors.white : colors.black,
                      },
                    ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.subHeading}>Colors</Text>
            <View style={styles.flexWrap}>
              {wallcolors.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.colorContainer,
                    {
                      padding: color == item ? 4 : 0,
                      borderWidth:
                        color == item ? 1 : item == 'white' ? 0.5 : 0,
                      borderColor:
                        color == item ? colors.black : colors.borderColor,
                    },
                  ]}
                  activeOpacity={0.7}
                  onPress={() => setColor(item)}>
                  <View
                    style={[
                      styles.colorstyle,
                      {
                        backgroundColor: item,
                      },
                    ]}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <View style={{flex: 1, justifyContent: 'flex-end'}}>
              <ButtonComponent
                title="Reset"
                style={styles.btn}
                onPress={handleResetFilter}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.99)',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  topLine: {
    width: '12%',
    height: 3,
    backgroundColor: colors.lightBlack,
    alignSelf: 'center',
    marginTop: 8,
    borderRadius: 22,
  },
  mainContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginTop: 20,
    flex: 1,
  },
  heading: {
    fontFamily: fontFamily.rubik_medium,
    fontSize: 24,
    color: colors.food_light_black2,
    marginBottom: 20,
  },
  subHeading: {
    fontFamily: fontFamily.rubik_medium,
    fontSize: 16,
    color: colors.food_light_black2,
    marginBottom: 12,
  },
  flexWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  colorContainer: {
    width: 44,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 6,
  },
  colorstyle: {
    width: 38,
    height: 28,
    borderRadius: 6,
    backgroundColor: 'red',
  },
  typeContainer: {
    borderWidth: 1,
    borderColor: colors.food_light_black2,
    borderRadius: 8,
    borderCurve: 'continuous',
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  txt: {
    fontSize: 14,
    fontFamily: fontFamily.rubik_medium,
    color: colors.black,
    textTransform: 'capitalize',
  },
  btn: {
    backgroundColor: colors.food_light_black2,
    borderRadius: 8,
  },
});

export default WallpaperFilterModal;
