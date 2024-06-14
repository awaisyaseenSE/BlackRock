import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React, {useRef, useState} from 'react';
import ScreenComponent from '../../components/ScreenComponent';
import colors from '../../styles/colors';
import fontFamily from '../../styles/fontFamily';
import ButtonComponent from '../../components/ButtonComponent';
import TopCompoWithHeading from '../../components/TopCompoWithHeading';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../../navigation/navigationStrings';
import * as Animatable from 'react-native-animatable';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import AnimatedBottomSheet from './AnimatedCustomBottomSheet';

export default function AnimationPractiseScreen() {
  const navigation = useNavigation();
  const [show, setShow] = useState(true);
  const zoomOut = {
    0: {
      opacity: 1,
      scale: 1,
    },
    0.5: {
      opacity: 1,
      scale: 0.3,
    },
    1: {
      opacity: 0,
      scale: 0,
    },
  };

  const fadeIn = {
    from: {
      opacity: 0,
      color: colors.blue,
    },
    to: {
      opacity: 1,
      color: colors.white,
    },
  };

  const fadeInImage = {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  };

  const fadeOut = {
    from: {
      opacity: 1,
    },
    to: {
      opacity: 0,
    },
  };

  const viewRef = useRef(null);

  const bounce = () => {
    if (viewRef.current) {
      viewRef.current
        .bounce(500)
        .then(endState =>
          console.log(
            endState.finished ? 'bounce finished' : 'bounce cancelled',
          ),
        );
    }
  };

  const [front, setFront] = useState(true);
  const [anim, setAnim] = useState('');

  const flippingAnimation = {
    0: {
      rotateY: '0deg',
    },
    1: {
      rotateY: '360deg',
    },
  };
  const reverseFlippingAnimation = {
    0: {
      rotateY: '0deg',
    },
    1: {
      rotateY: '360deg',
    },
  };

  //   const flip = () => {
  //     if (front) {
  //       setAnim(flippingAnimation);
  //       setTimeout(() => {
  //         setFront(false);
  //       }, 500);
  //     } else {
  //       setAnim(reverseFlippingAnimation);
  //       setTimeout(() => {
  //         setFront(true);
  //       }, 500);
  //     }
  //   };

  const flip = () => {
    if (front) {
      setAnim(flippingAnimation);
      setTimeout(() => {
        setFront(false);
        setAnim(''); // Reset animation to re-trigger
      }, 1000);
    } else {
      setAnim(reverseFlippingAnimation);
      setTimeout(() => {
        setFront(true);
        setAnim(''); // Reset animation to re-trigger
      }, 1000);
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ScreenComponent style={{backgroundColor: colors.moviesBg}}>
        <TopCompoWithHeading
          title="Animation"
          onPress={() => navigation.goBack()}
        />
        {/* <View style={styles.container}> */}
        {/* <Animatable.Text
            duration={7000}
            animation={zoomOut}
            style={styles.txt}>
            Zoom me out
          </Animatable.Text>

          <Animatable.Text
            animation={fadeIn}
            duration={3000}
            style={styles.txt}>
            Fade me in
          </Animatable.Text>
          <TouchableOpacity
            style={styles.btn}
            activeOpacity={0.8}
            onPress={bounce}>
            <Animatable.View ref={viewRef}>
              <Text style={[styles.txt, {marginBottom: 0}]}>Bounce me!</Text>
            </Animatable.View>
          </TouchableOpacity>

          <Animatable.Image
            source={{
              uri: 'https://images.pexels.com/photos/25158812/pexels-photo-25158812/free-photo-of-boy-standing-in-an-orange-room.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load',
            }}
            style={{
              width: 120,
              height: 120,
              marginTop: 30,
              alignSelf: 'center',
              borderRadius: 12,
            }}
            // animation="zoomInUp"
            animation={fadeInImage}
            duration={5000}
            easing={'linear'}
          />

          <Animatable.Text
            style={styles.txt}
            animation="flipInX"
            iterationCount={2}
            // direction="alternate"
          >
            Up and down you go
          </Animatable.Text>
          <Animatable.Text
            style={styles.txt}
            animation="pulse"
            easing="ease-out"
            iterationCount="infinite">
            ❤️
          </Animatable.Text> */}

        {/* {show && (
            // onPress={() => setShow(!show)}
            <TouchableOpacity
              activeOpacity={0.6}
              style={{
                alignSelf: 'center',
                width: '50%',
              }}>
              <Animatable.View
                style={[
                  styles.btn,
                  {backgroundColor: colors.dark_Red, width: '100%'},
                ]}
                animation={'fadeOut'}>
                <Animatable.Text style={styles.btnTxt}>Remove</Animatable.Text>
              </Animatable.View>
            </TouchableOpacity>
          )} */}

        {/* {show && (
            <TouchableOpacity
              activeOpacity={1}
              style={{
                alignSelf: 'center',
                width: '50%',
              }}
              onPress={() => setShow(!show)}>
              <Animatable.View
                style={[
                  styles.btn,
                  {backgroundColor: colors.dark_Red, width: '100%'},
                ]}
                animation={!show ? 'fadeOut' : null}>
                <Animatable.Text style={styles.btnTxt}>Remove</Animatable.Text>
              </Animatable.View>
            </TouchableOpacity>
          )} */}

        {/* <Animatable.Text
            style={styles.txt}
            animation="zoomInUp"
            // duration={2000}
            // iterationCount={1}
            // iterationDelay={1000}
          >
            This is Zoom in Up effect!
          </Animatable.Text>

          <Animatable.Text
            animation="zoomInDown"
            duration={3000}
            style={styles.txt}>
            Zoom in Down !!!
          </Animatable.Text>

          <Animatable.Text
            style={styles.txt} // Example 3
            animation="zoomIn"
            duration={3000}
            delay={1000}>
            Zoom in !!!
          </Animatable.Text>

          <Animatable.Text
            style={styles.txt} // Example 4
            animation="zoomInLeft"
            duration={3000}>
            Zoom in Left !!!
          </Animatable.Text>

          <Animatable.Text
            style={styles.txt} // Example 5
            animation="zoomInRight"
            duration={3000}
            iterationCount={2}>
            Zoom in Right !!!
          </Animatable.Text> */}
        {/* </View> */}
        {/* <View style={styles.container}>
          <Animatable.View
            animation={anim}
            duration={5000}
            style={{flex: 1, overflow: 'hidden'}}>
            {front ? (
              <View style={{backgroundColor: colors.gray, flex: 1}}>
                <TouchableOpacity style={styles.iconContaine} onPress={flip}>
                  <Image
                    source={require('../../assets/sync.png')}
                    style={styles.icon}
                  />
                </TouchableOpacity>

                <Text> This is front</Text>
              </View>
            ) : (
              <View style={{backgroundColor: colors.grey, flex: 1}}>
                <TouchableOpacity style={styles.iconContaine} onPress={flip}>
                  <Image
                    source={require('../../assets/sync.png')}
                    style={styles.icon}
                  />
                </TouchableOpacity>

                <Text> This is back</Text>
              </View>
            )}
          </Animatable.View>
        </View> */}
        {/* <GestureHandlerRootView style={{flex: 1}}>
          <View style={styles.container}>
            <ButtonComponent title="Open" onPress={() => setIsOpen(!isOpen)} />
            <AnimatedBottomSheet
              isOpen={isOpen}
              backdropOnPress={() => setIsOpen(prevState => !prevState)}
              height={500}>
              <Text>Hello this is bottom sheet</Text>
            </AnimatedBottomSheet>
          </View>
        </GestureHandlerRootView> */}

        <View style={styles.container}></View>
      </ScreenComponent>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: 20,
    // paddingVertical: 20,
  },
  txt: {
    fontSize: 14,
    color: colors.offWhite,
    fontFamily: fontFamily.rubik_medium,
    marginBottom: 14,
    // opacity: 0.2,
  },
  btn: {
    backgroundColor: colors.darkBlue,
    width: '50%',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  btnTxt: {
    fontSize: 16,
    color: colors.white,
    fontFamily: fontFamily.rubik_medium,
  },
  icon: {
    width: 18,
    height: 18,
    tintColor: colors.darkBlue,
  },
  iconContaine: {
    width: 66,
    height: 64,
    backgroundColor: colors.onBoardingBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomRightRadius: 60,
    overflow: 'hidden',
  },
});
