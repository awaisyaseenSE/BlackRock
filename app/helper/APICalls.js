import constants from '../constants/constants';

export const getApi = async url => {
  const API_URL = `${constants.theMovieDb_BASE_URL}${url}?api_key=${constants.theMovieDb_API_KEY}`;
  console.log(API_URL);
  try {
    let response = await fetch(API_URL);
    response = await response.json();
    return response;
  } catch (error) {
    console.log('Error in Api call file: ', error);
    return null;
  }
};
