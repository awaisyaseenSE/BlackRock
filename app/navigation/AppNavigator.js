import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabRoutes from './TabRoutes';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawer from './CustomDrawer';
import AboutScreen from '../screens/AboutScreen';
import {Dimensions, Platform} from 'react-native';
import DetailProductScreen from '../screens/DetailProductScreen';
import RealTimeDatabase from '../screens/RealTimeDatabase';
import OnboardingScreen from '../screens/OnboardingScreen';
import constants from '../constants/constants';
import DetailMovieScreen from '../screens/DetailMovieScreen';
import AllMoviesList from '../screens/AllMoviesList';
import SimilarMovieDetailScreen from '../screens/SimilarMovieDetailScreen';
import AllSimilarMoviesScreen from '../screens/AllSimilarMoviesScreen';
import AllCatogoryMovieScreen from '../screens/AllCatogoryMovieScreen';
import BottomTabComponent from '../components/BottomTabComponent';
import BottomTabNavigator from './BottomTabNavigator';
import MovieCollectionScreen from '../screens/MovieCollectionScreen';
import ShowMovieCollectionScreen from '../screens/ShowMovieCollectionScreen';
import TodoScreen from '../screens/Todo/screens/TodoScreen';
import CreateTodoScreen from '../screens/Todo/screens/CreateTodoScreen';
import FindMovieByYearScreen from '../screens/FindMovieByYearScreen';
import UpdateTodoScreen from '../screens/Todo/screens/UpdateTodoScreen';
import SearchPexelsPhotosScreen from '../screens/SearchPexelsPhotosScreen';
import DetailPhotoScreen from '../screens/DetailPhotoScreen';
import FlashListTestingScreen from '../screens/FlashListTestingScreen';
import SearchPexelsVideos from '../screens/SearchPexelsVideos';
import PexelsVideosScreen from '../screens/PexelsVideosScreen';
import ShowVideoScreen from '../screens/ShowVideoScreen';
import PexelCollectionScreen from '../screens/PexelCollectionScreen';
import PhotoEditingScreen from '../screens/PhotoEditingScreen';
import FavoriteMovieScreen from '../screens/FavoriteMovieScreen';
import ShowAllTradingMoviesScreen from '../screens/ShowAllTradingMoviesScreen';
import TrendingTvSerialScreen from '../screens/TrendingTvSerialScreen';
import AllUsersListScreen from '../screens/AllUsersListScreen';
import ChatScreen from '../screens/Chat/ChatScreen';
import NowPlayingMoviesScreen from '../screens/NowPlayingMoviesScreen';
import SearchMultiScreen from '../screens/SearchMultiScreen';
import FitnessXOnboardingScreen from '../screens/Fitness/FitnessXOnboardingScreen';
import FitnessXActivityTrackerScreen from '../screens/Fitness/FitnessXActivityTrackerScreen';
import PixabaySearchScreen from '../screens/PixabaySearchScreen';
import PixabaySearchVideos from '../screens/PixabaySearchVideos';
import WeatherAppHomeScreen from '../screens/WeatherAppHomeScreen';
import TopNewsScreen from '../screens/TopNewsScreen';
import DetailNewsScreen from '../screens/DetailNewsScreen';
import SearchNewsScreen from '../screens/SearchNewsScreen';
import RottonTomatosScreen from '../screens/RottonTomatosScreen';
import FoodRecipeHomeScreen from '../screens/Food/FoodRecipeHomeScreen';
import DetailFoodRecipeScreen from '../screens/Food/DetailFoodRecipeScreen';
import ReadArticelScreen from '../screens/Food/ReadArticelScreen';
import CoffeeGetStartedScreen from '../screens/CoffeeGetStartedScreen';
import CoffeeHomeScreen from '../screens/CoffeeHomeScreen';
import DetailCoffeeScreen from '../screens/DetailCoffeeScreen';
import AddCoffeeScreen from '../screens/AddCoffeeScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const {width, height} = Dimensions.get('window');

const DrawerNavigator = () => (
  <>
    <Drawer.Navigator
      // initialRouteName="TabRoutes"
      // screenOptions={{
      //   headerShown: false,
      //   drawerPosition: 'left',
      //   drawerActiveBackgroundColor: 'transparent',
      //   drawerInactiveBackgroundColor: 'transparent',
      // }}
      screenOptions={{
        drawerStyle: {
          width: width * 0.7,
          alignSelf: 'center',
        },
        sceneContainerStyle: {
          // backgroundColor: '#FFFFFF33',
        },
        swipeEdgeWidth: Platform.OS === 'android' && 100,
        headerShown: false,
        drawerPosition: 'left',
        drawerActiveBackgroundColor: 'transparent',
        drawerInactiveBackgroundColor: 'transparent',
        drawerActiveTintColor: 'red',
        drawerInactiveTintColor: 'green',
        overlayColor: 'transparent',
      }}
      drawerContent={props => <CustomDrawer {...props} />}>
      {/* <Drawer.Screen
        name="TabRoutes"
        component={TabRoutes}
        options={{headerShown: false}}
      /> */}
      <Drawer.Screen
        name="BottomTabNavigator"
        component={BottomTabNavigator}
        options={{headerShown: false}}
      />
    </Drawer.Navigator>
  </>
);

function AppNavigator() {
  return (
    // <Stack.Navigator initialRouteName="MainTabRoutes">
    <Stack.Navigator>
      {!constants.onBoardingStatus && (
        <Stack.Screen
          name="OnboardingScreen"
          component={OnboardingScreen}
          options={{
            headerShown: false,
          }}
        />
      )}
      <Stack.Screen
        name="MainTabRoutes"
        component={DrawerNavigator}
        options={{headerShown: false}}
      />
      {/* <Stack.Screen
        name="BottomTabNavigator"
        component={BottomTabNavigator}
        options={{headerShown: false}}
      /> */}
      <Stack.Screen
        name="AboutScreen"
        component={AboutScreen}
        options={{
          headerShown: false,
          // presentation: 'modal',
          // animationTypeForReplace: 'push',
          // animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="DetailProductScreen"
        component={DetailProductScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="RealTimeDatabase"
        component={RealTimeDatabase}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="DetailMovieScreen"
        component={DetailMovieScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AllMoviesList"
        component={AllMoviesList}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SimilarMovieDetailScreen"
        component={SimilarMovieDetailScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AllSimilarMoviesScreen"
        component={AllSimilarMoviesScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AllCatogoryMovieScreen"
        component={AllCatogoryMovieScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="MovieCollectionScreen"
        component={MovieCollectionScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ShowMovieCollectionScreen"
        component={ShowMovieCollectionScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="TodoScreen"
        component={TodoScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CreateTodoScreen"
        component={CreateTodoScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="UpdateTodoScreen"
        component={UpdateTodoScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="FindMovieByYearScreen"
        component={FindMovieByYearScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SearchPexelsPhotosScreen"
        component={SearchPexelsPhotosScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SearchPexelsVideos"
        component={SearchPexelsVideos}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PexelsVideosScreen"
        component={PexelsVideosScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="DetailPhotoScreen"
        component={DetailPhotoScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ShowVideoScreen"
        component={ShowVideoScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="FlashListTestingScreen"
        component={FlashListTestingScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PexelCollectionScreen"
        component={PexelCollectionScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PhotoEditingScreen"
        component={PhotoEditingScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="FavoriteMovieScreen"
        component={FavoriteMovieScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ShowAllTradingMoviesScreen"
        component={ShowAllTradingMoviesScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="TrendingTvSerialScreen"
        component={TrendingTvSerialScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AllUsersListScreen"
        component={AllUsersListScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="NowPlayingMoviesScreen"
        component={NowPlayingMoviesScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SearchMultiScreen"
        component={SearchMultiScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="FitnessXOnboardingScreen"
        component={FitnessXOnboardingScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="FitnessXActivityTrackerScreen"
        component={FitnessXActivityTrackerScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PixabaySearchScreen"
        component={PixabaySearchScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PixabaySearchVideos"
        component={PixabaySearchVideos}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="WeatherAppHomeScreen"
        component={WeatherAppHomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="TopNewsScreen"
        component={TopNewsScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="DetailNewsScreen"
        component={DetailNewsScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SearchNewsScreen"
        component={SearchNewsScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="RottonTomatosScreen"
        component={RottonTomatosScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="FoodRecipeHomeScreen"
        component={FoodRecipeHomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="DetailFoodRecipeScreen"
        component={DetailFoodRecipeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ReadArticelScreen"
        component={ReadArticelScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CoffeeGetStartedScreen"
        component={CoffeeGetStartedScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CoffeeHomeScreen"
        component={CoffeeHomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="DetailCoffeeScreen"
        component={DetailCoffeeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AddCoffeeScreen"
        component={AddCoffeeScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
export default AppNavigator;
