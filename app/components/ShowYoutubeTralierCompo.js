import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import colors from '../styles/colors';
import constants from '../constants/constants';

const ShowYoutubeTralierCompo = ({data}) => {
  const [youtubethumbnailUrl, setYoutubethumbnailUrl] = useState('');
  const [movieTitile, setMovieTitile] = useState('');
  const getMovieDetail = async () => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?key=${constants.youtube_API_KEY}&part=snippet&id=${data?.key}`,
      );

      if (!response.ok) {
        throw new Error('Failed to fetch YouTube data');
      }

      const mydata = await response.json();

      if (mydata && mydata.items && mydata.items.length > 0) {
        const thumbnailUrl = mydata.items[0].snippet.thumbnails.default.url;
        const mvTiltl = mydata.items[0].snippet.title;
        setMovieTitile(mvTiltl);
        setYoutubethumbnailUrl(thumbnailUrl);
      }

      return null; // Return null if no thumbnail found
    } catch (error) {
      console.error('Error fetching YouTube thumbnail:', error);
      return null;
    }
  };

  useEffect(() => {
    getMovieDetail();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={{color: colors.white}}>{movieTitile}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default ShowYoutubeTralierCompo;
