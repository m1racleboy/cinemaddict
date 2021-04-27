const movieToFilterMap = {
  all: (movies) => movies
    .filter((movie) => movie).length,
  watchlist: (movies) => movies
    .filter((movie) => movie.user_details.isWatchList).length,
  history: (movies) => movies
    .filter((movie) => movie.user_details.isHistory).length,
  favorites: (movies) => movies
    .filter((movie) => movie.user_details.isFavorite).length,
};

export const createFilter = (movies) => {
  return Object.entries(movieToFilterMap).map(([filterName, countMovies]) => {
    return {
      name: filterName,
      count: countMovies(movies),
    };
  });
};
