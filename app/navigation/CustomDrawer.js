import React from 'react';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import {Alert, View, Text, Platform, StyleSheet} from 'react-native';
import auth, {firebase} from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import useAuth from '../auth/useAuth';
import DrawerItemListCompo from './DrawerItemListCompo';
import navigationStrings from '../navigation/navigationStrings';
import firestore from '@react-native-firebase/firestore';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import FastImage from 'react-native-fast-image';

function CustomDrawer(props) {
  const navigation = useNavigation();
  const {logout} = useAuth();
  const userProfileImage = auth()?.currentUser?.photoURL;

  const handleLogout = () => {
    try {
      Alert.alert('Logout', 'Are you sure to Logout!', [
        {
          text: 'Yes',
          onPress: logout,
        },
        {
          text: 'No',
        },
      ]);
    } catch (error) {
      console.log('============ERROR WHILE LOG OUT========================');
      console.log(error);
      console.log('====================================');
    }
  };

  return (
    <>
      <DrawerContentScrollView
        style={{
          backgroundColor: colors.bottomTabBg,
          width: '100%',
          paddingHorizontal: 12,
        }}
        showsVerticalScrollIndicator={false}>
        <FastImage
          source={
            !!userProfileImage
              ? {uri: userProfileImage}
              : require('../assets/avatar.png')
          }
          style={styles.profileImage}
        />
        <Text
          style={[
            styles.userNameText,
            {marginTop: Platform.OS === 'android' ? 10 : 0},
          ]}>
          {!!auth().currentUser?.displayName
            ? auth()?.currentUser?.displayName
            : 'Anonymous'}
        </Text>
        <View style={{flex: 1, marginTop: 18}}>
          <DrawerItemListCompo
            image={require('../assets/checklist.png')}
            title="Todo Screen"
            onPress={() => navigation.navigate(navigationStrings.TODO_SCREEN)}
            txtStyle={{color: colors.lineColor}}
            iconStyle={{tintColor: colors.todoPink}}
          />
          <DrawerItemListCompo
            image={require('../assets/explore.png')}
            title="Space App"
            onPress={() =>
              navigation.navigate(navigationStrings.SpaceGetStartedScreen)
            }
            txtStyle={{color: colors.lineColor}}
            iconStyle={{tintColor: colors.white}}
          />
          <DrawerItemListCompo
            image={require('../assets/explore.png')}
            title="Investment App"
            onPress={() =>
              navigation.navigate(navigationStrings.InvestGetStartedScreen)
            }
            txtStyle={{color: colors.lineColor}}
            iconStyle={{tintColor: colors.white}}
          />
          <DrawerItemListCompo
            image={require('../assets/fitness.png')}
            title="Animation Screen"
            onPress={() =>
              navigation.navigate(navigationStrings.AnimationPractiseScreen)
            }
            txtStyle={{color: colors.lineColor}}
            iconStyle={{tintColor: colors.white}}
          />
          <DrawerItemListCompo
            image={require('../assets/tab_search.png')}
            title="Search Photos"
            onPress={() =>
              navigation.navigate(navigationStrings.SEARCH_PEXELS_SCREEN)
            }
            txtStyle={{color: colors.lineColor}}
            iconStyle={{tintColor: colors.white}}
          />
          <DrawerItemListCompo
            image={require('../assets/wallpaper/wallpaper_icon.png')}
            title="Wallpaper App"
            onPress={() =>
              navigation.navigate(navigationStrings.Walll_OnBoarding_Screen)
            }
            txtStyle={{color: colors.lineColor}}
            iconStyle={{tintColor: null}}
          />
          <DrawerItemListCompo
            image={require('../assets/wallpaper/wallpaper_icon.png')}
            title="Unsplash"
            onPress={() =>
              navigation.navigate(navigationStrings.Unsplash_Home_Screen)
            }
            txtStyle={{color: colors.lineColor}}
            iconStyle={{tintColor: null}}
          />
          <DrawerItemListCompo
            image={require('../assets/music-player.png')}
            title="Pixels Videos"
            onPress={() =>
              navigation.navigate(navigationStrings.Pexels_Videos_Screen)
            }
            txtStyle={{color: colors.lineColor}}
            iconStyle={{tintColor: colors.white}}
          />
          <DrawerItemListCompo
            image={require('../assets/photo-album.png')}
            title="Pixels Collection"
            onPress={() =>
              navigation.navigate(navigationStrings.Pexel_Collection_Screen)
            }
            txtStyle={{color: colors.lineColor}}
            iconStyle={{tintColor: colors.white}}
          />
          <DrawerItemListCompo
            image={require('../assets/edit-photo1.png')}
            title="Edit Photo"
            onPress={() =>
              navigation.navigate(navigationStrings.Photo_Editing_Screen)
            }
            txtStyle={{color: colors.lineColor}}
            iconStyle={{tintColor: null}}
          />
          <DrawerItemListCompo
            image={require('../assets/film.png')}
            title="Movie Collection"
            onPress={() =>
              navigation.navigate(navigationStrings.Movie_Collection_Screen)
            }
            txtStyle={{color: colors.lineColor}}
            iconStyle={{tintColor: colors.yellow}}
          />

          <DrawerItemListCompo
            image={require('../assets/find-movie.png')}
            title="Find Movies by Year"
            onPress={() =>
              navigation.navigate(navigationStrings.Find_Movie_by_year_SCREEN)
            }
            txtStyle={{color: colors.lineColor}}
            iconStyle={{tintColor: colors.yellow}}
          />
          <DrawerItemListCompo
            image={require('../assets/trend.png')}
            title="Trending Movies"
            onPress={() =>
              navigation.navigate(
                navigationStrings.Show_All_Trading_Movies_Screen,
              )
            }
            txtStyle={{color: colors.lineColor}}
            iconStyle={{tintColor: colors.yellow}}
          />
          <DrawerItemListCompo
            image={require('../assets/trend.png')}
            title="Tranding Tv Series"
            onPress={() =>
              navigation.navigate(navigationStrings.Trending_Tv_Serial_Screen)
            }
            txtStyle={{color: colors.lineColor}}
            iconStyle={{tintColor: colors.yellow}}
          />
          <DrawerItemListCompo
            image={require('../assets/star.png')}
            title="Your Favorite Movies"
            onPress={() =>
              navigation.navigate(navigationStrings.Favorite_Movie_Screen)
            }
            txtStyle={{color: colors.lineColor}}
            iconStyle={{tintColor: colors.yellow}}
          />
          <DrawerItemListCompo
            image={require('../assets/user.png')}
            title="All Users List"
            onPress={() =>
              navigation.navigate(navigationStrings.All_Users_List_Screen)
            }
            txtStyle={{color: colors.lineColor}}
            iconStyle={{tintColor: colors.lineColor}}
          />
          <DrawerItemListCompo
            image={require('../assets/tab_search.png')}
            title="Multi Search"
            onPress={() =>
              navigation.navigate(navigationStrings.Search_Multi_Screen)
            }
            txtStyle={{color: colors.lineColor}}
            iconStyle={{tintColor: colors.lineColor}}
          />
          <DrawerItemListCompo
            image={require('../assets/tab_search.png')}
            title="Pixabay Photos"
            onPress={() =>
              navigation.navigate(navigationStrings.Pixabay_Search_Screen)
            }
            txtStyle={{color: colors.lineColor}}
            iconStyle={{tintColor: colors.lineColor}}
          />
          <DrawerItemListCompo
            image={require('../assets/tab_search.png')}
            title="Pixabay Videos"
            onPress={() =>
              navigation.navigate(navigationStrings.Pixabay_Search_Videos)
            }
            txtStyle={{color: colors.lineColor}}
            iconStyle={{tintColor: colors.lineColor}}
          />
          <DrawerItemListCompo
            image={require('../assets/weather_media/cloud.png')}
            title="Weather App"
            onPress={() =>
              navigation.navigate(navigationStrings.WeatherAppHomeScreen)
            }
            txtStyle={{color: colors.lineColor}}
            iconStyle={{tintColor: colors.lineColor}}
          />
          <DrawerItemListCompo
            image={require('../assets/muscle.png')}
            title="Work Out"
            onPress={() =>
              navigation.navigate(navigationStrings.FitnessX_Onboarding_Screen)
            }
            txtStyle={{color: colors.lineColor}}
            iconStyle={{tintColor: colors.lineColor}}
          />
          <DrawerItemListCompo
            image={require('../assets/food/food.png')}
            title="Food Recepie"
            onPress={() =>
              navigation.navigate(navigationStrings.Food_Recipe_Home_Screen)
            }
            txtStyle={{color: colors.lineColor}}
            iconStyle={{tintColor: colors.lineColor}}
          />
          <DrawerItemListCompo
            image={require('../assets/coffee/coffee-cup.png')}
            title="Coffee"
            onPress={() =>
              navigation.navigate(navigationStrings.Coffee_GetStarted_Screen)
            }
            txtStyle={{color: colors.lineColor}}
            iconStyle={{tintColor: colors.lineColor}}
          />
          <DrawerItemListCompo
            image={require('../assets/news-1.png')}
            title="Top News"
            onPress={() =>
              navigation.navigate(navigationStrings.Top_News_Screen)
            }
            txtStyle={{color: colors.lineColor}}
            iconStyle={{tintColor: colors.lineColor}}
          />
          <DrawerItemListCompo
            image={require('../assets/find-movie.png')}
            title="Rotton Tomatos Movies"
            onPress={() =>
              navigation.navigate(navigationStrings.Rotton_Tomatos_Screen)
            }
            txtStyle={{color: colors.lineColor}}
            iconStyle={{tintColor: colors.lineColor}}
          />
          <DrawerItemListCompo
            image={require('../assets/emoji.png')}
            title="FlahList"
            onPress={() =>
              navigation.navigate(navigationStrings.FlashList_Testing_Screen)
            }
            txtStyle={{color: colors.lineColor}}
            iconStyle={{tintColor: colors.lineColor}}
          />
        </View>
      </DrawerContentScrollView>
      <View
        style={{
          paddingVertical: 24,
          paddingHorizontal: 12,
          backgroundColor: colors.black,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.36,
          shadowRadius: 6.68,

          elevation: 11,
        }}>
        <DrawerItemListCompo
          image={require('../assets/exit.png')}
          title="Logout"
          style={{marginBottom: Platform.OS === 'ios' ? 8 : 2}}
          onPress={handleLogout}
          txtStyle={{color: colors.lineColor}}
          iconStyle={{tintColor: colors.lineColor}}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  userNameText: {
    fontSize: 14,
    color: colors.lineColor,
    fontFamily: fontFamily.rubik_medium,
    marginTop: 20,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginTop: 12,
    marginBottom: 20,
  },
});

export default CustomDrawer;
