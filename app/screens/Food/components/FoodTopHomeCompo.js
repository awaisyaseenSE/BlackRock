import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import colors from '../../../styles/colors';

const FoodTopHomeCompo = ({onPress, loading = false}) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/food/man.png')}
        style={styles.leftIcon}
      />
      <TouchableOpacity onPress={onPress} disabled={loading}>
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
});

export default FoodTopHomeCompo;
