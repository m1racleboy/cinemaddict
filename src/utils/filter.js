import { FilterType } from '../const.js';

export const filter = {
  [FilterType.ALL]: (movies) => movies,
  [FilterType.WATCH_LIST]: (movies) => movies.filter((movie) => movie.userDetails.isWatchList),
  [FilterType.HISTORY]: (movies) => movies.filter((movie) => movie.userDetails.isHistory),
  [FilterType.FAVORITES]: (movies) => movies.filter((movie) => movie.userDetails.isFavorite),
};
