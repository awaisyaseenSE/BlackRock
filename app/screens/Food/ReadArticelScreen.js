import {View, Text, ActivityIndicator, StatusBar, Platform} from 'react-native';
import React, {useState} from 'react';
import ScreenComponent from '../../components/ScreenComponent';
import TopCompoWithHeading from '../../components/TopCompoWithHeading';
import {useNavigation} from '@react-navigation/native';
import colors from '../../styles/colors';
import {WebView} from 'react-native-webview';

export default function ReadArticelScreen({route}) {
  const navigation = useNavigation();
  const articleLink = route?.params?.link;
  const [laoding, setLoading] = useState(true);
  return (
    <ScreenComponent style={{backgroundColor: colors.weather_Search_Bg}}>
      <StatusBar
        backgroundColor={colors.black}
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
      />
      <TopCompoWithHeading
        title={'Read Full Article'}
        onPress={() => navigation.goBack()}
        style={{backgroundColor: colors.food_Light_yellow}}
      />
      <View style={{flex: 1}}>
        {laoding && (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1,
            }}>
            <ActivityIndicator size={'large'} color={colors.red} />
          </View>
        )}
        <WebView
          source={{uri: articleLink}}
          style={{backgroundColor: colors.black}}
          onLoad={() => console.log('loading start')}
          onLoadEnd={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            console.log('Getting Error in loading url of your article!');
          }}
        />
      </View>
    </ScreenComponent>
  );
}
