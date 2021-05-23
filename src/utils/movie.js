import dayjs from 'dayjs';

const MAX_MINUTES = 59;
const MINUTES_PER_HOUR = 60;

export const sortMoviesByRating = (a, b) => b.movie_info.rating - a.movie_info.rating;

export const sortMoviesByDate = (a, b) => dayjs(b.release.date).diff(dayjs(a.release.date));

export const getDuration = (number) => {
  return number > MAX_MINUTES ? `${Math.floor(number / MINUTES_PER_HOUR)}h ${number % MINUTES_PER_HOUR}m` : `${number % MINUTES_PER_HOUR}m`;
};
