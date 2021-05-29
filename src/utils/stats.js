import dayjs from 'dayjs';
import { StatsFilter } from '../const.js';

const MAX_MINUTES = 59;
const MINUTES_PER_HOUR = 60;

export const makeItemsUniq = (items) => [...new Set(items)];

export const getCountMoviesByGenre = (movies, genre) => {
  return movies.filter((movie) => movie.movieInfo.genre.some((genreItem) => genreItem === genre)).length;
};

export const getMinDatePeriod = (period) => {
  if (period === StatsFilter.ALL_TIME) {
    return false;
  }

  if (period === StatsFilter.TODAY) {
    return dayjs().set('hour', 0).set('minute', 0).set('second', 0).format();
  }

  return dayjs().subtract(1, period).format();
};

export const isDateAfter = (startDate, date) => {
  return dayjs(date).isAfter(dayjs(startDate));
};

export const getDuration = (number) => {
  return number > MAX_MINUTES ? `${Math.floor(number / MINUTES_PER_HOUR)}h ${number % MINUTES_PER_HOUR}m` : `${number % MINUTES_PER_HOUR}m`;
};
