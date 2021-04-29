import dayjs from 'dayjs';
import { createElement } from '../utils/common.js';

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

export default class MovieCard {
  constructor(movie) {
    this._movie = movie;
    this._element = null;
  }

  getTemplate() {
    return createMovieCardTemplate(this._movie);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
