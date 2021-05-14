import dayjs from 'dayjs';

const MAX_MINUTES = 59;
const MINUTES_PER_HOUR = 60;

export const sortMoviesByRating = (a, b) => {
  if (a.movie_info.rating < b.movie_info.rating) {
    return 1;
  }
  if (a.movie_info.rating > b.movie_info.rating) {
    return -1;
  }

  return 0;
};

export const sortMoviesByDate = (a, b) => {
  return dayjs(b.release.date).diff(dayjs(a.release.date));
};

export const getDuration = (number) => {
  return number > MAX_MINUTES ? `${Math.floor(number / MINUTES_PER_HOUR)}h ${number % MINUTES_PER_HOUR}m` : `${number % MINUTES_PER_HOUR}m`;
};
