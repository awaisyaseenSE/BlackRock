import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import React from 'react';
import colors from '../../../styles/colors';

const FoodTopHomeCompo = ({onPress, loading = false, onPressFilter}) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/food/man.png')}
        style={styles.leftIcon}
      />
      <View style={styles.row}>
        <TouchableOpacity onPress={onPressFilter}>
          <Image
            source={require('../../../assets/food/ic_filter.png')}
            style={styles.rightIcon1}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onPress}
          disabled={loading}
          style={styles.rightIconContainer}>
          {loading ? (
            <ActivityIndicator size={'small'} color={colors.food_yellow} />
          ) : (
            <Image
              source={require('../../../assets/explore.png')}
              style={styles.rightIcon}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 20,
    marginTop: Platform.OS === 'android' ? 8 : 0,
  },
  leftIcon: {
    width: 40,
    height: 40,
  },
  rightIcon: {
    width: 26,
    height: 26,
    tintColor: colors.lightBlack,
  },
  rightIcon1: {
    width: 20,
    height: 20,
    tintColor: colors.lightBlack,
    marginRight: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightIconContainer: {
    width: 26,
    height: 26,
  },
});

export default FoodTopHomeCompo;
