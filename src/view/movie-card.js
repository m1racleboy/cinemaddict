import dayjs from 'dayjs';

import AbstractView from './abstract.js';

import { MovieCardButtons } from '../const.js';
import { getDuration } from '../utils/stats.js';

const MAX_DESCRIPTION_LENGTH = 139;
const CONTROL_ACTIVE = ' film-card__controls-item--active';

const createMovieCardTemplate = (movie = {}) => {
  const {
    movieInfo: {
      title, rating, poster, description, duration, genre,
    },
    userDetails: {
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
              <span class="film-card__year">${+dayjs(date).year()}</span>
              <span class="film-card__duration">${getDuration(duration)}</span>
              <span class="film-card__genre">${genre.join(', ')}</span>
            </p>
            <img src="${poster}" alt="${title}" class="film-card__poster">
            <p class="film-card__description">${description.length > MAX_DESCRIPTION_LENGTH ? description.substr(0, MAX_DESCRIPTION_LENGTH) + '...' : description}</p>
            <a class="film-card__comments">${comments.length} ${comments.length === 1 ? 'comment' : 'comments'}</a>
            <div class="film-card__controls">
              <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist${isWatchList ? CONTROL_ACTIVE : ''}"
              data-control="${MovieCardButtons.WATCH_LIST}" type="button">Add to watchlist</button>
              <button class="film-card__controls-item button film-card__controls-item--mark-as-watched${isHistory ? CONTROL_ACTIVE : ''}"
              data-control="${MovieCardButtons.WATCHED}" type="button">Mark as watched</button>
              <button class="film-card__controls-item button film-card__controls-item--favorite${isFavorite ? CONTROL_ACTIVE : ''}"
              data-control="${MovieCardButtons.FAVORITE}" type="button">Mark as favorite</button>
            </div>
          </article>`;
};

export default class MovieCard extends AbstractView {
  constructor(movie) {
    super();
    this._movie = movie;
    this._element = null;
    this._handleOpenPopupClick = this._handleOpenPopupClick.bind(this);
    this._handleControlsClick = this._handleControlsClick.bind(this);
  }

  getTemplate() {
    return createMovieCardTemplate(this._movie);
  }

  _handleOpenPopupClick(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  _handleControlsClick(evt) {
    if (evt.target.dataset.control) {
      evt.preventDefault();
      this._callback.controlClick(evt.target.dataset.control);
    }
  }

  setControlsClickHandler(callback) {
    this._callback.controlClick = callback;
    this.getElement().addEventListener('click', this._handleControlsClick);
  }

  setOpenPopupHandler(callback) {
    this._callback.click = callback;
    this.getElement()
      .querySelector('.film-card__poster')
      .addEventListener('click', this._handleOpenPopupClick);
    this.getElement()
      .querySelector('.film-card__title')
      .addEventListener('click', this._handleOpenPopupClick);
    this.getElement()
      .querySelector('.film-card__comments')
      .addEventListener('click', this._handleOpenPopupClick);
  }
}
