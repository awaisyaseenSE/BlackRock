import {View, Text} from 'react-native';
import React, {useState} from 'react';
import ScreenComponent from '../components/ScreenComponent';
import TopCompoWithHeading from '../components/TopCompoWithHeading';
import {useNavigation} from '@react-navigation/native';
import colors from '../styles/colors';
import {WebView} from 'react-native-webview';
import MyIndicatorLoader from '../components/MyIndicatorLoader';

export default function DetailNewsScreen({route}) {
  const navigation = useNavigation();
  const articleLink = route?.params?.link;
  const [laoding, setLoading] = useState(true);
  return (
    <ScreenComponent style={{backgroundColor: colors.moviesBg}}>
      <TopCompoWithHeading
        title={'Read Full Article'}
        onPress={() => navigation.goBack()}
      />
      <View style={{flex: 1}}>
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
      <MyIndicatorLoader visible={laoding} />
    </ScreenComponent>
  );
}
