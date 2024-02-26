import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import colors from '../styles/colors';
import ScreenComponent from '../components/ScreenComponent';
import TopCompoWithHeading from '../components/TopCompoWithHeading';
import {useNavigation} from '@react-navigation/native';
import {getApi} from '../helper/APICalls';
import ShowTvSeriesCompo from '../components/ShowTvSeriesCompo';
import fontFamily from '../styles/fontFamily';
import MyIndicator from '../components/MyIndicator';
import constants from '../constants/constants';

export default function AllCatogoryMovieScreen() {
  const [laoding, setLoading] = useState(false);
  const navigation = useNavigation();
  const [allGenres, setAllGenres] = useState([]);
  const [selectedGenre, setSelectedGenere] = useState(null);
  const [movieDataBasedOnGenere, setMovieDataBasedOnGenere] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [endReached, setEndReached] = useState(false);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [allMoviesData, setAllMoviesData] = useState([]);
  const [allMoviecurrentPage, setAlllMoviecurrentPage] = useState(1);
  const [allMovieTotalPage, setAlllMovietotalPage] = useState(1);
  const [allMoviesendReached, setAllMovieEndReached] = useState(false);

  //   const getMovieTralierYoutube = async () => {
  //     try {
  //       setLoading(true);
  //       let res = await getApi('/movie/157336/videos');
  //       if (!!res) {
  //         setLoading(false);
  //         let finalData = res?.results;
  //         setYoutubeTralierData(finalData);
  //       } else {
  //         setLoading(false);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //       setLoading(false);
  //     }
  //   };

  //   const getPopularTvSeries = async () => {
  //     try {
  //       setLoading(true);
  //       let res = await getApi('/tv/popular');
  //       if (!!res) {
  //         setLoading(false);
  //         let finalData = res?.results;
  //         setPopularTvSeriesData(finalData);
  //         console.log('popular tv: ', finalData.length);
  //       } else {
  //         setLoading(false);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //       setLoading(false);
  //     }
  //   };

  //   const geDiscoverTVSeries = async () => {
  //     try {
  //       setLoading(true);
  //       let res = await getApi('/tv/airing_today');
  //       if (!!res) {
  //         setLoading(false);
  //         let finalData = res?.results;
  //         setDiscoverTvSeriesData(finalData);
  //       } else {
  //         setLoading(false);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //       setLoading(false);
  //     }
  //   };

  // tv/changes

  //   const getTVChanges = async () => {
  //     try {
  //       setLoading(true);
  //       let res = await getApi('/tv/changes');
  //       if (!!res) {
  //         setLoading(false);
  //         let finalData = res?.results;
  //         setTvChanges(finalData);
  //       } else {
  //         setLoading(false);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //       setLoading(false);
  //     }
  //   };

  //   const getActionMovies = async () => {
  //     // let realURL =
  //     //   'https://api.themoviedb.org/3/discover/movie?api_key=9f2de56397d6a9ae9d096f42d24bbac7&certification_country=US&certification=R&include_adult=false';
  //     let url = '/discover/movie';
  //     let adultCertificate = '&include_adult=false';
  //     let API_URL = `${constants.theMovieDb_BASE_URL}${url}?api_key=${constants.theMovieDb_API_KEY}${adultCertificate}`;
  //     try {
  //       setLoading(true);
  //       let response = await fetch(API_URL);

  //       if (!response.ok) {
  //         setLoading(false);
  //         throw new Error(`HTTP error! Status: ${response.status}`);
  //       }

  //       let responseData = await response.json();
  //       let allMoviesData = responseData?.results;
  //       if (responseData?.results?.length > 0) {
  //         setActionMovies(allMoviesData);
  //       }
  //       setLoading(false);
  //     } catch (error) {
  //       setLoading(false);
  //       console.error(
  //         'Error in getting movies data in All catory movie screen:',
  //         error,
  //       );
  //     }
  //   };

  const getGenery = async () => {
    try {
      setLoading(true);
      let res = await getApi('/genre/movie/list');
      if (!!res) {
        setLoading(false);
        let allGener = res?.genres;
        setAllGenres(allGener);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  //   const handleGetDataBasedOnGenere = async genreID => {
  //     console.log('id is: ', genreID);
  //     try {
  //       setLoading(true);
  //       const apiKey = 'YOUR_API_KEY';
  //       const response = await fetch(
  //         `https://api.themoviedb.org/3/discover/movie?api_key=${constants.theMovieDb_API_KEY}&with_genres=${genreID}`,
  //       );
  //       if (!response.ok) {
  //         setLoading(false);
  //         throw new Error(`HTTP error! Status: ${response.status}`);
  //       }
  //       const data = await response.json();
  //       if (!!data) {
  //         let allData = data?.results;
  //         console.log('total pages: ', data?.total_pages);
  //         // setMovieDataBasedOnGenere(allData);
  //         // const nextPageResponse = await fetch(
  //         //   `https://api.themoviedb.org/3/discover/movie?api_key=${
  //         //     constants.theMovieDb_API_KEY
  //         //   }&with_genres=${genreID}&page=${50}`,
  //         // );
  //         // const nextPageData = await nextPageResponse.json();
  //         // console.log('data of page 50 ', nextPageData);
  //         // let allMovies = [];
  //         let allMovies = [];
  //         allMovies.push(allData);
  //         for (let page = 2; page <= 8; page++) {
  //           console.log(page);
  //           const nextPageResponse = await fetch(
  //             `https://api.themoviedb.org/3/discover/movie?api_key=${constants.theMovieDb_API_KEY}&with_genres=${genreID}&page=${page}`,
  //           );
  //           const nextPageData = await nextPageResponse.json();
  //           console.log('hello ', nextPageData.results);
  //           allMovies.push(...nextPageData.results);
  //           console.log('hello');
  //         }
  //         setMovieDataBasedOnGenere(allMovies);
  //       }
  //       setLoading(false);
  //     } catch (error) {
  //       setLoading(false);
  //       console.error('Error fetching movies by genre:', error);
  //     }
  //   };

  const handleGetDataBasedOnGenere = async genreID => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${constants.theMovieDb_API_KEY}&with_genres=${genreID}&page=${currentPage}`,
      );

      if (!response.ok) {
        setLoading(false);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (!!data) {
        // Update total pages
        setTotalPages(data.total_pages);

        // Concatenate new data with existing data
        setMovieDataBasedOnGenere(prevData => [...prevData, ...data.results]);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching movies by genre:', error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getGenery();
  }, []);

  const handleEndReached = () => {
    if (currentPage < totalPages && !laoding) {
      // Fetch next page of data
      setCurrentPage(prevPage => prevPage + 1);
      handleGetDataBasedOnGenere(selectedGenre);
    }
  };

  const handleGenreSelection = async genreID => {
    setSelectedGenere(genreID);
    setCurrentPage(1); // Reset current page to 1 when selecting a new genre
    setMovieDataBasedOnGenere([]); // Clear previous movie data
    setIsAllSelected(false);
    await handleGetDataBasedOnGenere(genreID); // Fetch data for the selected genre
  };

  const handleAllClick = () => {
    setIsAllSelected(true);
    setMovieDataBasedOnGenere([]);
    setSelectedGenere(null);
  };

  const handleFlatlistHeaderCompo = () => {
    return (
      <TouchableOpacity
        style={[
          styles.catogryNameContainer,
          {
            height: 30,
            backgroundColor: isAllSelected ? colors.black : colors.lightBlack,
          },
        ]}
        onPress={handleAllClick}>
        <Text style={styles.catogryNameText}>All</Text>
      </TouchableOpacity>
    );
  };

  const getAllMovies = async () => {
    try {
      setIsAllSelected(true);
      setLoading(true);
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${constants.theMovieDb_API_KEY}&page=${allMoviecurrentPage}`,
      );

      if (!response.ok) {
        setLoading(false);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (!!data) {
        setLoading(false);
        setAlllMovietotalPage(data?.total_pages);
        setAllMoviesData(prevData => [...prevData, ...data.results]);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getAllMovies();
  }, []);

  const handleEndReachedAllMovies = () => {
    if (allMoviecurrentPage < allMovieTotalPage && !laoding) {
      // Fetch next page of data
      setAlllMoviecurrentPage(prevPage => prevPage + 1);
      getAllMovies();
    }
  };

  return (
    <>
      <ScreenComponent style={{backgroundColor: colors.moviesBg}}>
        <TopCompoWithHeading
          title="All Catogory"
          onPress={() => navigation.goBack()}
        />
        <View style={styles.container}>
          {allGenres.length > 0 && (
            <View style={styles.flatListContainer}>
              <FlatList
                data={allGenres}
                renderItem={({item, index}) => (
                  <TouchableOpacity
                    style={[
                      styles.catogryNameContainer,
                      {
                        backgroundColor:
                          selectedGenre == item?.id
                            ? colors.black
                            : colors.lightBlack,
                      },
                    ]}
                    onPress={() => handleGenreSelection(item?.id)}
                    activeOpacity={0.6}>
                    <Text style={styles.catogryNameText}>{item?.name}</Text>
                  </TouchableOpacity>
                )}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                ListHeaderComponent={handleFlatlistHeaderCompo}
              />
            </View>
          )}

          {movieDataBasedOnGenere.length > 0 && (
            <FlatList
              data={movieDataBasedOnGenere}
              renderItem={({item}) => <ShowTvSeriesCompo data={item} />}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              numColumns={2}
              ItemSeparatorComponent={<View style={{marginVertical: 4}} />}
              onEndReached={handleEndReached}
              onEndReachedThreshold={0.5}
              ListFooterComponent={() => {
                if (endReached) {
                  return null; // No activity indicator if end is reached
                }

                return laoding ? (
                  <ActivityIndicator size="large" color={colors.blue} />
                ) : null;
              }}
              onMomentumScrollEnd={() => {
                if (!endReached) {
                  setEndReached(true);
                }
              }}
            />
          )}

          {isAllSelected && (
            // <Text style={styles.catogryNameText}>All movies</Text>
            <FlatList
              data={allMoviesData}
              renderItem={({item}) => <ShowTvSeriesCompo data={item} />}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              numColumns={2}
              ItemSeparatorComponent={<View style={{marginVertical: 4}} />}
              onEndReached={handleEndReachedAllMovies}
              onEndReachedThreshold={0.5}
              ListFooterComponent={() => {
                if (allMoviesendReached) {
                  return null; // No activity indicator if end is reached
                }

                return laoding ? (
                  <ActivityIndicator size="large" color={colors.blue} />
                ) : null;
              }}
              onMomentumScrollEnd={() => {
                if (!allMoviesendReached) {
                  setAllMovieEndReached(true);
                }
              }}
            />
          )}
        </View>
      </ScreenComponent>
      <MyIndicator visible={laoding} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  catogryNameContainer: {
    backgroundColor: colors.lightBlack,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catogryNameText: {
    color: colors.LightWhite,
    fontFamily: fontFamily.rubik_medium,
    fontSize: 12,
  },
  flatListContainer: {
    height: 30,
    marginBottom: 14,
    paddingLeft: 16,
  },
});
