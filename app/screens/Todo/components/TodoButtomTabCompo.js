import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import React from 'react';
import colors from '../../../styles/colors';
import fontFamily from '../../../styles/fontFamily';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const TodoButtomTabCompo = ({selectedTab, setSelectedTab}) => {
  const insets = useSafeAreaInsets();

  const mystyle = {
    footerTxtContainer: {
      flex: 1,
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: Platform.OS == 'ios' ? insets.bottom : 8,
      paddingTop: 20,
    },
  };

  return (
    <>
      <View
        style={[
          styles.footer,
          {
            // paddingBottom: Platform.OS == 'ios' ? insets.bottom : 8,
            height: Platform.OS === 'ios' ? 46 + insets.bottom : 60 + 8,
            // paddingTop: 20,
          },
        ]}>
        <TouchableOpacity
          style={[
            mystyle.footerTxtContainer,
            {
              borderTopWidth: selectedTab === 0 ? 1.5 : 0,
              borderTopColor:
                selectedTab === 0 ? colors.black : colors.todoWhite,
            },
          ]}
          onPress={() => setSelectedTab(0)}>
          <Image
            source={require('../../../assets/today.png')}
            style={[
              styles.icon,
              {
                tintColor:
                  selectedTab === 0 ? colors.black : colors.lightBlackTwo,
              },
            ]}
          />
          <Text
            style={[
              styles.footerTxt,
              {
                color: selectedTab === 0 ? colors.black : colors.lightBlackTwo,
              },
            ]}>
            Today
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            mystyle.footerTxtContainer,
            {
              borderTopWidth: selectedTab === 1 ? 1.5 : 0,
              borderTopColor:
                selectedTab === 1 ? colors.black : colors.todoWhite,
            },
          ]}
          onPress={() => setSelectedTab(1)}>
          <Image
            source={require('../../../assets/future.png')}
            style={[
              styles.icon,
              {
                tintColor:
                  selectedTab === 1 ? colors.black : colors.lightBlackTwo,
              },
            ]}
          />
          <Text
            style={[
              styles.footerTxt,
              {
                color: selectedTab === 1 ? colors.black : colors.lightBlackTwo,
              },
            ]}>
            Later
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            mystyle.footerTxtContainer,
            {
              borderTopWidth: selectedTab === 2 ? 1.5 : 0,
              borderTopColor:
                selectedTab === 2 ? colors.black : colors.todoWhite,
            },
          ]}
          onPress={() => setSelectedTab(2)}>
          <Image
            source={require('../../../assets/checkmark.png')}
            style={[
              styles.icon,
              {
                tintColor:
                  selectedTab === 2 ? colors.black : colors.lightBlackTwo,
              },
            ]}
          />
          <Text
            style={[
              styles.footerTxt,
              {
                color: selectedTab === 2 ? colors.black : colors.lightBlackTwo,
              },
            ]}>
            History
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    height: 50,
    backgroundColor: colors.todoWhite,
    paddingHorizontal: 4,
  },
  //   footerTxtContainer: {
  //     flex: 1,
  //     height: '100%',
  //     alignItems: 'center',
  //     justifyContent: 'center',
  //   },
  footerTxt: {
    fontSize: 10,
    fontFamily: fontFamily.rubik_medium,
    color: colors.lightBlackTwo,
    marginTop: 2,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: colors.lightBlackTwo,
  },
});

export default TodoButtomTabCompo;

// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   Platform,
// } from 'react-native';
// import React from 'react';
// import colors from '../../../styles/colors';
// import fontFamily from '../../../styles/fontFamily';
// import {useSafeAreaInsets} from 'react-native-safe-area-context';

// const TodoButtomTabCompo = ({selectedTab, setSelectedTab}) => {
//   const insets = useSafeAreaInsets();

//   return (
//     <>
//       <View
//         style={[
//           styles.footer,
//           {
//             paddingBottom: Platform.OS == 'ios' ? insets.bottom : 8,
//             height: Platform.OS === 'ios' ? 46 + insets.bottom : 60 + 8,
//             paddingTop: 20,
//           },
//         ]}>
//         <TouchableOpacity
//           style={[styles.footerTxtContainer]}
//           onPress={() => setSelectedTab(0)}>
//           <Image
//             source={require('../../../assets/today.png')}
//             style={[
//               styles.icon,
//               {
//                 tintColor: selectedTab === 0 ? colors.lineColor : colors.gray,
//               },
//             ]}
//           />
//           <Text
//             style={[
//               styles.footerTxt,
//               {
//                 color: selectedTab === 0 ? colors.lineColor : colors.gray,
//               },
//             ]}>
//             Today
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.footerTxtContainer]}
//           onPress={() => setSelectedTab(1)}>
//           <Image
//             source={require('../../../assets/future.png')}
//             style={[
//               styles.icon,
//               {
//                 tintColor: selectedTab === 1 ? colors.lineColor : colors.gray,
//               },
//             ]}
//           />
//           <Text
//             style={[
//               styles.footerTxt,
//               {
//                 color: selectedTab === 1 ? colors.lineColor : colors.gray,
//               },
//             ]}>
//             Later
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.footerTxtContainer]}
//           onPress={() => setSelectedTab(2)}>
//           <Image
//             source={require('../../../assets/checkmark.png')}
//             style={[
//               styles.icon,
//               {
//                 tintColor: selectedTab === 2 ? colors.lineColor : colors.gray,
//               },
//             ]}
//           />
//           <Text
//             style={[
//               styles.footerTxt,
//               {
//                 color: selectedTab === 2 ? colors.lineColor : colors.gray,
//               },
//             ]}>
//             History
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   footer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 4,
//     height: 50,
//     backgroundColor: colors.todoBlue,
//     borderTopRightRadius: 32,
//     borderTopLeftRadius: 32,
//   },
//   footerTxtContainer: {
//     flex: 1,
//     height: '100%',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   footerTxt: {
//     fontSize: 10,
//     fontFamily: fontFamily.rubik_medium,
//     color: colors.gray,
//     marginTop: 2,
//   },
//   icon: {
//     width: 24,
//     height: 24,
//     resizeMode: 'contain',
//     tintColor: colors.gray,
//   },
// });

// export default TodoButtomTabCompo;
