import {
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Text,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenComponent from '../components/ScreenComponent';
import FastImage from 'react-native-fast-image';
import colors from '../styles/colors';
import MyIndicatorLoader from '../components/MyIndicatorLoader';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../navigation/navigationStrings';
import fontFamily from '../styles/fontFamily';
import TopCompoWithHeading from '../components/TopCompoWithHeading';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import generateChatId from '../utils/GenerateChatId';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

export default function AllUsersListScreen() {
  const [laoding, setLoading] = useState(false);
  const navigation = useNavigation();
  const [allUsers, setAllUsers] = useState([]);
  const currentUserId = auth()?.currentUser?.uid;

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .onSnapshot(snapshot => {
        setLoading(true);
        const users = [];
        snapshot.forEach(doc => {
          const userData = doc.data();
          const userId = doc.id;
          if (userId !== currentUserId) {
            users.push({...userData, id: userId});
          }
        });
        setAllUsers(users);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  const handleChatScreenNavi = userId => {
    if (userId == currentUserId) {
      return null;
    } else {
      const routeData = generateChatId(currentUserId, userId);
      navigation.navigate(navigationStrings.Chat_Screen, routeData);
    }
  };

  const renderItem = ({item}) => {
    let myfastImgLoading = true;
    return (
      <TouchableOpacity
        style={styles.userDetailContainer}
        activeOpacity={0.8}
        onPress={() => handleChatScreenNavi(item?.id)}>
        <View style={styles.userImgStyle}>
          <FastImage
            source={{uri: item?.imageUrl}}
            style={[styles.userImgStyle, {zIndex: 1}]}
            onLoadStart={() => (myfastImgLoading = true)}
            onLoadEnd={() => (myfastImgLoading = false)}
          />
          {myfastImgLoading && (
            <View style={styles.fastImgLoadingStyle}>
              <ActivityIndicator animating size={20} color={colors.gray} />
            </View>
          )}
        </View>
        <Text style={styles.userNameStyle}>{item?.fullName}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <ScreenComponent style={{backgroundColor: colors.moviesBg}}>
        <TopCompoWithHeading
          title="All Users List"
          onPress={() => navigation.goBack()}
        />
        <View style={styles.container}>
          <FlatList
            data={allUsers}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScreenComponent>
      <MyIndicatorLoader visible={laoding} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userImgStyle: {
    width: 66,
    height: 66,
    borderRadius: 33,
  },
  userNameStyle: {
    fontSize: 14,
    color: colors.lineColor,
    fontFamily: fontFamily.rubik_semi_bold,
    marginLeft: 14,
  },
  fastImgLoadingStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDetailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
});
