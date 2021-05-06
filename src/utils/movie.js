import dayjs from 'dayjs';

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
