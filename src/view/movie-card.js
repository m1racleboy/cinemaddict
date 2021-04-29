import dayjs from 'dayjs';
import AbstractView from './abstract.js';

const MAX_DESCRIPTION_LENGTH = 139;
const CONTROL_ACTIVE = 'film-card__controls-item--active';

const createMovieCardTemplate = (movie = {}) => {
  const {
    movie_info: {
      title, rating, poster, description, duration, genre,
    },
    user_details: {
      isWatchList, isHistory, isFavorite,
    },
    comments,
    release: {
      date,
    },
  } = movie;
  return `<article class="film-card">
            <h3 class="film-card__title">${title}</h3>
            <p class="film-card__rating">${rating}</p>
            <p class="film-card__info">
              <span class="film-card__year">${dayjs(date).format('YYYY')}</span>
              <span class="film-card__duration">${duration}</span>
              <span class="film-card__genre">${genre}</span>
            </p>
            <img src=${poster} alt="" class="film-card__poster">
            <p class="film-card__description">${description.length > MAX_DESCRIPTION_LENGTH ? description.substr(0, MAX_DESCRIPTION_LENGTH) + '...' : description}</p>
            <a class="film-card__comments">${comments.length} comments</a>
            <div class="film-card__controls">
              <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${isWatchList ? CONTROL_ACTIVE : ''}" type="button">Add to watchlist</button>
              <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${isHistory ? CONTROL_ACTIVE : ''}" type="button">Mark as watched</button>
              <button class="film-card__controls-item button film-card__controls-item--favorite ${isFavorite ? CONTROL_ACTIVE : ''}" type="button">Mark as favorite</button>
            </div>
          </article>`;
};

export default class MovieCard extends AbstractView {
  constructor(movie) {
    super();
    this._movie = movie;
    this._element = null;
    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createMovieCardTemplate(this._movie);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector('.film-card__poster').addEventListener('click', this._clickHandler);
    this.getElement().querySelector('.film-card__title').addEventListener('click', this._clickHandler);
    this.getElement().querySelector('.film-card__comments').addEventListener('click', this._clickHandler);
  }
}
