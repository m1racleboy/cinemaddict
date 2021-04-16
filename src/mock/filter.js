const taskToFilterMap = {
  watchlist: (movies) => movies
    .filter((movie) => movie.user_details.isWatchList).length,
  history: (movies) => movies
    .filter((movie) => movie.user_details.isHistory).length,
  favorites: (movies) => movies
    .filter((movie) => movie.user_details.isFavorite).length,
};

export const generateFilter = (movies) => {
  return Object.entries(taskToFilterMap).map(([filterName, countTasks]) => {
    return {
      name: filterName,
      count: countTasks(movies),
    };
  });
};
