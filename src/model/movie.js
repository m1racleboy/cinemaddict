import Observer from '../utils/observer.js';

export default class Movies extends Observer {
  constructor() {
    super();
    this._movies = [];
  }

  setMovies(updateType, movies) {
    this._movies = movies.slice();

    this._notify(updateType);
  }

  getMovies() {
    return this._movies;
  }

  updateMovie(updateType, update) {
    const index = this._movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting Movie');
    }

    this._movies = [
      ...this._movies.slice(0, index),
      update,
      ...this._movies.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  static adaptToClient(movie) {
    const adaptedMovie = Object.assign(
      {},
      movie,
      {
        movieInfo: {
          title: movie['film_info'].title,
          alternativeTitle: movie['film_info']['alternative_title'],
          poster: movie['film_info'].poster,
          description: movie['film_info'].description,
          rating: movie['film_info']['total_rating'],
          duration: movie['film_info'].runtime,
          genre: movie['film_info'].genre,
          director: movie['film_info'].director,
          writers: movie['film_info'].writers,
          actors: movie['film_info'].actors,
          ageRating: movie['film_info']['age_rating'],
        },
        release: {
          date: movie['film_info'].release.date,
          releaseCountry: movie['film_info'].release['release_country'],
        },
        userDetails: {
          isWatchList: movie['user_details']['watchlist'],
          isHistory: movie['user_details']['already_watched'],
          isFavorite: movie['user_details'].favorite,
          watchingDate: movie['user_details']['watching_date'],
        },
      },
    );

    delete adaptedMovie['film_info'];
    delete adaptedMovie['user_details'];

    return adaptedMovie;
  }

  static adaptToServer(movie) {
    const adaptedMovie = Object.assign(
      {},
      movie,
      {
        'film_info': {
          'title': movie.movieInfo.title,
          'alternative_title': movie.movieInfo.alternativeTitle,
          'poster': movie.movieInfo.poster,
          'description': movie.movieInfo.description,
          'total_rating': movie.movieInfo.rating,
          'runtime': movie.movieInfo.duration,
          'genre': movie.movieInfo.genre,
          'director': movie.movieInfo.director,
          'writers': movie.movieInfo.writers,
          'actors': movie.movieInfo.actors,
          'age_rating': movie.movieInfo.ageRating,
          'release': {
            'date': movie.release.date,
            'release_country': movie.release.releaseCountry,
          },
        },
        'user_details': {
          'watchlist': movie.userDetails.isWatchList,
          'already_watched': movie.userDetails.isHistory,
          'favorite': movie.userDetails.isFavorite,
          'watching_date': movie.userDetails.watchingDate,
        },
      },
    );

    delete adaptedMovie.movieInfo;
    delete adaptedMovie.userDetails;

    return adaptedMovie;
  }
}
