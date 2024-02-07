import {View, Text, Button} from 'react-native';
import React from 'react';
import ScreenComponent from '../components/ScreenComponent';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  Value3D,
  withTiming,
} from 'react-native-reanimated';

export default function SearchScreen() {
  const translateX = useSharedValue(0);
  const handleShowValue = () => {
    console.log(translateX.value);
  };

  const handlePress = () => {
    translateX.value = withSpring(translateX.value + 50);
  };
  const handleDecreasePress = () => {
    translateX.value = withSpring(translateX.value - 50);
  };

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{translateX: withTiming(translateX.value * 2, {duration: 50})}],
  }));

  return (
    <>
      <ScreenComponent style={{backgroundColor: 'beige'}}>
        <View style={{flex: 1}}>
          <Text style={{marginVertical: 12}}>Search Screen</Text>
          <View style={{alignItems: 'center'}}>
            <Animated.View
              style={[
                {
                  width: 100,
                  height: 100,
                  backgroundColor: 'skyblue',
                },
                animatedStyles,
              ]}
            />
            <Button title="show value" onPress={handleShowValue} />
            <Button title="Increase Value" onPress={handlePress} />
            <Button title="Decrease Value" onPress={handleDecreasePress} />
          </View>
        </View>
      </ScreenComponent>
    </>
  );
}
