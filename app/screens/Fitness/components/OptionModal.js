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

const OptionModal = ({optionModal = false, setOptionModal, position}) => {
  return (
    <Modal visible={optionModal} transparent animationType="slide">
      {/* <View style={styles.topContainer}>
        <TouchableOpacity
          style={{flex: 1}}
          onPress={() => setOptionModal(false)}
        />
        <View style={styles.container}>
          <View style={{flex: 1}}>
            <Text>slkdfsflkdsfklj</Text>
          </View>
        </View>
      </View> */}
      <TouchableOpacity
        style={{
          backgroundColor: 'red',
          top: position.y + 20,
          left: position.x,
          width: '90%',
        }}>
        <Text>
          Hello sfnsf ks,fnskjf ksfksdkfklsdjflksd l lkjlj
          fljslkfjlsjfldsjflkjsdlfjl lsjfljslfjlsdfjlsd ls
        </Text>
      </TouchableOpacity>
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
});

export default OptionModal;
