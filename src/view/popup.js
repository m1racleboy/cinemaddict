import dayjs from 'dayjs';
import SmartView from './smart.js';
import { EMOJIS } from '../const.js';
import { getDuration } from '../utils/movie.js';
import { nanoid } from 'nanoid';

const ENTER_KEY = 13;

const addNewComment = () => {
  const comment = {
    id: nanoid(),
    author: 'Me',
    comment: '',
    date: dayjs(),
    emotion: null,
  };

  return comment;
};

const getChecked = (check) => check ? 'checked' : '';

const createControlTemplate = (control) => {
  const { name, title, check } = control;

  return `<input type='checkbox' class='film-details__control-input visually-hidden' id='${name}' name='${name}' ${getChecked(check)}>
          <label for='${name}' class='film-details__control-label film-details__control-label--${name}'>${title}</label>`;
};

const createCommentTemplate = (comments) => {
  comments.sort((a, b) => {
    const date1 = dayjs(a.date);
    const date2 = dayjs(b.date);

    return date1.diff(date2);
  });

  return Object.values(comments).map(({ author, comment, date, emotion }) =>
    `<li class='film-details__comment'>
      <span class='film-details__comment-emoji'>
        <img src='./images/emoji/${emotion}.png' width='55' height='55' alt='emoji-${emotion}'>
      </span>
      <div>
        <p class='film-details__comment-text'>${comment}</p>
        <p class='film-details__comment-info'>
          <span class='film-details__comment-author'>${author}</span>
          <span class='film-details__comment-day'>${dayjs(date).format('YYYY/MM/DD HH:mm')}</span>
          <button type='button' class='film-details__comment-delete'>Delete</button>
        </p>
      </div>
     </li>
  `).join('');
};

const createEmojiListTemplate = (currentEmoji) => {
  return EMOJIS.map((emoji) => `<input class='film-details__emoji-item visually-hidden' name='comment-emoji' type='radio' id='emoji-${emoji}' value='${emoji}' ${emoji === currentEmoji ? 'checked' : ''}>
                      <label class='film-details__emoji-label' for='emoji-${emoji}'>
                        <img src='./images/emoji/${emoji}.png' width='30' height='30' alt='emoji'>
                      </label>`).join('');
};

const createPopupTemplate = (movie) => {
  const {
    movie_info: {
      title, poster, age_rating, rating, director, writers, actors, genre, description, duration,
    },
    release: {
      date, release_country,
    },
    user_details: {
      isWatchList, isHistory, isFavorite,
    },
    comments,
    currentCommentEmoji,
    currentCommentText,
  } = movie;

  const commentsCount = comments.length;
  const commentsTemplate = createCommentTemplate(comments);

  const Controls = [
    {
      name: 'watchlist',
      title: 'Add to watchlist',
      check: isWatchList,
    },
    {
      name: 'watched',
      title: 'Already watched',
      check: isHistory,
    },
    {
      name: 'favorite',
      title: 'Add to favorites',
      check: isFavorite,
    },
  ];

  Controls.map((control) => {
    return control;
  });

  const controlItemsTemplate = Controls
    .map((control) => createControlTemplate(control))
    .join('');

  return `<section class='film-details'>
            <form class='film-details__inner' action='' method='get'>
              <div class='film-details__top-container'>
                <div class='film-details__close'>
                  <button class='film-details__close-btn' type='button'>close</button>
                </div>
                <div class='film-details__info-wrap'>
                  <div class='film-details__poster'>
                    <img class='film-details__poster-img' src=${poster} alt=''>
                    <p class='film-details__age'>${age_rating}+</p>
                  </div>
                  <div class='film-details__info'>
                    <div class='film-details__info-head'>
                      <div class='film-details__title-wrap'>
                        <h3 class='film-details__title'>${title}</h3>
                        <p class='film-details__title-original'>Original: ${title}</p>
                      </div>
                      <div class='film-details__rating'>
                        <p class='film-details__total-rating'>${rating}</p>
                      </div>
                    </div>
                    <table class='film-details__table'>
                      <tr class='film-details__row'>
                        <td class='film-details__term'>Director</td>
                        <td class='film-details__cell'>${director}</td>
                      </tr>
                      <tr class='film-details__row'>
                        <td class='film-details__term'>Writers</td>
                        <td class='film-details__cell'>${writers}</td>
                      </tr>
                      <tr class='film-details__row'>
                        <td class='film-details__term'>Actors</td>
                        <td class='film-details__cell'>${actors}</td>
                      </tr>
                      <tr class='film-details__row'>
                        <td class='film-details__term'>Release Date</td>
                        <td class='film-details__cell'>${dayjs(date).format('DD MMMM YYYY')}</td>
                      </tr>
                      <tr class='film-details__row'>
                        <td class='film-details__term'>Runtime</td>
                        <td class='film-details__cell'>${getDuration(duration)}</td>
                      </tr>
                      <tr class='film-details__row'>
                        <td class='film-details__term'>Country</td>
                        <td class='film-details__cell'>${release_country}</td>
                      </tr>
                      <tr class='film-details__row'>
                        <td class='film-details__term'>${genre.length === 1 ? 'Genre' : 'Genres'}</td>
                        <td class='film-details__cell'>
                          <span class='film-details__genre'>${genre}</span>
                      </tr>
                    </table>
                    <p class='film-details__film-description'>${description}</p>
                  </div>
                </div>
                <section class='film-details__controls'>
                  ${controlItemsTemplate}
                </section>
              </div>
              <div class='film-details__bottom-container'>
                <section class='film-details__comments-wrap'>
                  <h3 class='film-details__comments-title'>Comments <span class='film-details__comments-count'>${commentsCount}</span></h3>
                  <ul class='film-details__comments-list'>
                    ${commentsTemplate}
                  </ul>
                  <div class='film-details__new-comment'>
                    <div class='film-details__add-emoji-label'>
                      ${currentCommentEmoji ? `<img src="images/emoji/${currentCommentEmoji}.png" width="55" height="55" alt="emoji-smile">` : ''}
                    </div>
                    <label class='film-details__comment-label'>
                      <textarea class='film-details__comment-input' placeholder='Select reaction below and write comment here' name='comment'>${currentCommentText ? currentCommentText : ''}</textarea>
                    </label>
                    <div class='film-details__emoji-list'>
                      ${createEmojiListTemplate(currentCommentEmoji)}
                    </div>
                  </div>
                </section>
              </div>
            </form>
          </section>`;
};

export default class Popup extends SmartView {
  constructor(movie) {
    super();

    this._data = Popup.parseDataToState(movie);
    this._element = null;

    this._closePopupHandler = this._closePopupHandler.bind(this);
    this._watchListClickHandler = this._watchListClickHandler.bind(this);
    this._historyClickHandler = this._historyClickHandler.bind(this);
    this._favoritesClickHandler = this._favoritesClickHandler.bind(this);
    this._changeEmojiHandler = this._changeEmojiHandler.bind(this);
    this._inputCommentTextHandler = this._inputCommentTextHandler.bind(this);
    this._sendCommentHandler = this._sendCommentHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createPopupTemplate(this._data);
  }

  reset(movie) {
    this.updateData(
      Popup.parseDataToState(movie),
    );
  }

  restoreHandlers() {
    this._setInnerHandlers();

    this.setClosePopupHandler(this._callback.click);
    this.setWatchListClickHandler(this._callback.watchListClick);
    this.setHistoryClickHandler(this._callback.watchedClick);
    this.setFavoritesClickHandler(this._callback.favoritesClick);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.film-details__emoji-list')
      .addEventListener('change', this._changeEmojiHandler);
    this.getElement()
      .querySelector('.film-details__comment-input')
      .addEventListener('input', this._inputCommentTextHandler);
    this.getElement()
      .addEventListener('keydown', this._sendCommentHandler);
  }

  _sendCommentHandler(evt) {
    if ((evt.ctrlKey || evt.metaKey) && evt.keyCode === ENTER_KEY) {
      if (!this._data.currentCommentEmoji || !this._data.currentCommentText) {
        return;
      }
      this._data = Popup.parseStateToData(this._data);
      this.updateElement();
      this._callback.addComment(this._data);
    }
  }

  _changeEmojiHandler(evt) {
    evt.preventDefault();
    this.updateData({ currentCommentEmoji: evt.target.value });
  }

  _inputCommentTextHandler(evt) {
    evt.preventDefault();
    this.updateData({ currentCommentText: evt.target.value }, false);
  }

  _closePopupHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  _watchListClickHandler() {
    this._callback.watchListClick();
  }

  _historyClickHandler() {
    this._callback.watchedClick();
  }

  _favoritesClickHandler() {
    this._callback.favoritesClick();
  }

  setClosePopupHandler(callback) {
    this._callback.click = callback;
    this.getElement()
      .querySelector('.film-details__close-btn')
      .addEventListener('click', this._closePopupHandler);
  }

  setWatchListClickHandler(callback) {
    this._callback.watchListClick = callback;
    this.getElement()
      .querySelector('.film-details__control-label--watchlist')
      .addEventListener('click', this._watchListClickHandler);
  }

  setHistoryClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement()
      .querySelector('.film-details__control-label--watched')
      .addEventListener('click', this._historyClickHandler);
  }

  setFavoritesClickHandler(callback) {
    this._callback.favoritesClick = callback;
    this.getElement()
      .querySelector('.film-details__control-label--favorite')
      .addEventListener('click', this._favoritesClickHandler);
  }

  setAddCommentHandler(callback) {
    this._callback.addComment = callback;
  }

  static parseDataToState(movieData) {
    return Object.assign(
      {},
      movieData,
      {
        currentCommentEmoji: 'currentEmoji' in movieData,
        currentCommentText: '',
      },
    );
  }

  static parseStateToData(movieData) {
    movieData = Object.assign({}, movieData);

    const newComment = addNewComment();

    newComment.comment = movieData.currentCommentText;
    newComment.emotion = movieData.currentCommentEmoji;

    movieData.comments.push(newComment);

    delete movieData.currentCommentText;
    delete movieData.currentCommentEmoji;

    return movieData;
  }
}
