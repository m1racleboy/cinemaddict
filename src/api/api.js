import MoviesModel from '../model/movie.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299,
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  async getMovies() {
    const response = await this._load({ url: 'movies' });
    const movies = await Api.toJSON(response);
    return movies.map(MoviesModel.adaptToClient);
  }

  async getComments(movieId) {
    const response = await this._load({ url: `comments/${movieId}` });
    return Api.toJSON(response);
  }

  async updateMovie(movie) {
    const response = await this._load({
      url: `movies/${movie.id}`,
      method: Method.PUT,
      body: JSON.stringify(MoviesModel.adaptToServer(movie)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    const updatedMovie = await Api.toJSON(response);
    return MoviesModel.adaptToClient(updatedMovie);
  }

  async addComment(comment, movieId) {
    const response = await this._load({
      url: `comments/${movieId}`,
      method: Method.POST,
      body: JSON.stringify(comment),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    const updatedComment = await Api.toJSON(response);
    return updatedComment.comments[updatedComment.comments.length - 1];
  }

  deleteComment(commentId) {
    return this._load({
      url: `comments/${commentId}`,
      method: Method.DELETE,
    });
  }

  async sync(data) {
    const response = await this._load({
      url: 'movies/sync',
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    return Api.toJSON(response);
  }

  async _load({ url, method = Method.GET, body = null, headers = new Headers() }) {
    headers.append('Authorization', this._authorization);

    try {
      const response = await fetch(`${this._endPoint}/${url}`, { method, body, headers });
      return Api.checkStatus(response);
    } catch (err) {
      return Api.catchError(err);
    }
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN ||
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
