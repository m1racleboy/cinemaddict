import MoviesModel from '../model/movie.js';
import { isOnline } from '../utils/common.js';
import { StoreDataType } from '../const.js';

const getSyncedMovies = (items) => {
  return items.filter(({ success }) => success)
    .map(({ payload }) => payload.movie);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getMovies() {
    if (isOnline()) {
      return this._api.getMovies()
        .then((movies) => {
          const items = createStoreStructure(movies.map(MoviesModel.adaptToServer));
          this._store.setItems(items, StoreDataType.MOVIES);
          return movies;
        });
    }

    const storeMovies = Object.values(this._store.getItems()[StoreDataType.MOVIES]);

    return Promise.resolve(storeMovies.map(MoviesModel.adaptToClient));
  }

  getComments(movieId) {
    if (isOnline()) {
      return this._api.getComments(movieId)
        .then((comments) => {
          const items = createStoreStructure(comments);
          this._store.setItems(items, StoreDataType.COMMENTS);
          return comments;
        });
    }

    const storeMovies = Object.values(this._store.getItems()[StoreDataType.COMMENTS]);

    return Promise.resolve(storeMovies);
  }

  updateMovie(movie) {
    if (isOnline()) {
      return this._api.updateMovie(movie)
        .then((updatedMovie) => {
          this._store.setItem(updatedMovie.id, MoviesModel.adaptToServer(updatedMovie), StoreDataType.MOVIES);
          return updatedMovie;
        });
    }

    this._store.setItem(movie.id, MoviesModel.adaptToServer(Object.assign({}, movie)), StoreDataType.MOVIES);

    return Promise.resolve(movie);
  }

  addComment(comment, movieId) {
    if (isOnline()) {
      return this._api.addComment(comment, movieId)
        .then((response) => {
          const newComment = response.comments[response.comments.length - 1];
          this._store.setItem(newComment.id, newComment, StoreDataType.COMMENTS);
          return newComment;
        });
    }

    return Promise.reject(new Error('Add comment failed'));
  }

  deleteComment(commentId) {
    if (isOnline()) {
      return this._api.deleteComment(commentId)
        .then(() => this._store.removeItem(commentId, StoreDataType.COMMENTS));
    }

    return Promise.reject(new Error('Delete comment failed'));
  }

  sync() {
    if (isOnline()) {
      const storeMovies = Object.values(this._store.getItems()[StoreDataType.MOVIES]);

      return this._api.sync(storeMovies)
        .then((response) => {
          const updatedMovies = getSyncedMovies(response.updated);

          const items = createStoreStructure([...updatedMovies]);

          this._store.setItems(items, StoreDataType.MOVIES);
        });
    }

    return Promise.reject(new Error('Sync data failed'));
  }
}
