import dayjs from 'dayjs';

export const sortMoviesByRating = (a, b) => b.movie_info.rating - a.movie_info.rating;

export const sortMoviesByDate = (a, b) => dayjs(b.release.date).diff(dayjs(a.release.date));
