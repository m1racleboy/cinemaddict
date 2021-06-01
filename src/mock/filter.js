const movieToFilterMap = {
  all: (movies) => movies
    .filter((movie) => movie).length,
  watchlist: (movies) => movies
    .filter((movie) => movie.userDetails.isWatchList).length,
  history: (movies) => movies
    .filter((movie) => movie.userDetails.isHistory).length,
  favorites: (movies) => movies
    .filter((movie) => movie.userDetails.isFavorite).length,
};

export const createFilter = (movies) => {
  return Object.entries(movieToFilterMap).map(([filterName, countMovies]) => {
    return {
      name: filterName,
      count: countMovies(movies),
    };
  });
};
