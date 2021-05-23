import { FilterType } from '../const.js';

export const filter = {
  [FilterType.ALL]: (movies) => movies,
  [FilterType.WATCH_LIST]: (movies) => movies.filter((movie) => movie.user_details.isWatchList),
  [FilterType.HISTORY]: (movies) => movies.filter((movie) => movie.user_details.isHistory),
  [FilterType.FAVORITES]: (movies) => movies.filter((movie) => movie.user_details.isFavorite),
};
