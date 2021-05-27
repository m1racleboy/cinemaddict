import dayjs from 'dayjs';

export const sortMoviesByRating = (a, b) => b.movieInfo.rating - a.movieInfo.rating;

export const sortMoviesByDate = (a, b) => dayjs(b.release.date).diff(dayjs(a.release.date));
