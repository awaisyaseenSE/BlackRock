import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import React from 'react';
import ScreenComponent from '../../../components/ScreenComponent';
import colors from '../../../styles/colors';
import fontFamily from '../../../styles/fontFamily';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const PriorityModalCompo = ({
  setTodoPriority,
  setShowPriorityModal,
  showPriorityModal,
}) => {
  return (
    <Modal visible={showPriorityModal} transparent animationType="slide">
      <ScreenComponent style={{backgroundColor: 'rgba(0, 0, 0, 0.4)'}}>
        <TouchableOpacity
          style={styles.container}
          activeOpacity={0.8}
          onPress={() => setShowPriorityModal(false)}>
          <View style={styles.mainContainer}>
            <TouchableOpacity
              style={styles.textContainer}
              onPress={() => {
                setTodoPriority('low');
                setShowPriorityModal(false);
              }}>
              <Image
                source={require('../../../assets/dot.png')}
                style={[styles.icon, {tintColor: colors.todoGreen}]}
              />
              <Text style={[styles.text, {color: colors.todoGreen}]}>Low</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.textContainer}
              onPress={() => {
                setTodoPriority('medium');
                setShowPriorityModal(false);
              }}>
              <Image
                source={require('../../../assets/dot.png')}
                style={[styles.icon, {tintColor: colors.todoYellow}]}
              />
              <Text style={[styles.text, {color: colors.todoYellow}]}>
                Medium
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.textContainer}
              onPress={() => {
                setTodoPriority('high');
                setShowPriorityModal(false);
              }}>
              <Image
                source={require('../../../assets/dot.png')}
                style={styles.icon}
              />
              <Text style={styles.text}>High</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </ScreenComponent>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainer: {
    backgroundColor: colors.todoWhite,
    width: '90%',
    height: screenHeight / 4,
    borderRadius: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  icon: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
    tintColor: colors.todoRed,
  },
  text: {
    fontSize: 16,
    fontFamily: fontFamily.rubik_semi_bold,
    marginLeft: 12,
    color: colors.todoRed,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    marginBottom: 8,
  },
});

export default PriorityModalCompo;
