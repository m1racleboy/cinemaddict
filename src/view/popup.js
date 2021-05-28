import dayjs from 'dayjs';
import he from 'he';

import SmartView from './smart.js';

import { getComments } from '../utils/comment.js';
import { EMOJIS, MovieCardButtons } from '../const.js';
import { getDuration } from '../utils/stats.js';

const createCommentTemplate = (comments) => {
  comments.sort((a, b) => {
    const date1 = dayjs(a.date);
    const date2 = dayjs(b.date);

    return date1.diff(date2);
  });

  return comments.map(({ id, author, comment, date, emotion }) =>
    `<li class='film-details__comment'>
      <span class='film-details__comment-emoji'>
        <img src='./images/emoji/${emotion}.png' width='55' height='55' alt='emoji-${emotion}'>
      </span>
      <div>
        <p class='film-details__comment-text'>${he.encode(comment)}</p>
        <p class='film-details__comment-info'>
          <span class='film-details__comment-author'>${author}</span>
          <span class='film-details__comment-day'>${dayjs(date).format('YYYY/MM/DD HH:mm')}</span>
          <button type='button' class='film-details__comment-delete' data-comment-id="${id}">Delete</button>
        </p>
      </div>
     </li>
  `).join('');
};

const createEmojiListTemplate = (checkedEmoji) => {
  return EMOJIS.map((emoji) => `<input class='film-details__emoji-item visually-hidden' name='comment-emoji' type='radio' id='emoji-${emoji}' value='${emoji}' ${emoji === checkedEmoji ? 'checked' : ''}>
                      <label class='film-details__emoji-label' for='emoji-${emoji}'>
                        <img src='./images/emoji/${emoji}.png' width='30' height='30' alt='emoji'>
                      </label>`).join('');
};

const createPopupTemplate = (movie, allComments) => {
  const {
    movieInfo: {
      title, poster, ageRating, rating, director, writers, actors, genre, description, duration, alternativeTitle,
    },
    release: {
      date, releaseCountry,
    },
    userDetails: {
      isWatchList, isHistory, isFavorite,
    },
    comments,
    isEmojiChecked,
    checkedEmoji,
    commentText,
  } = movie;

  const commentsCount = comments.length;
  const commentsList = getComments(comments, allComments);
  const commentsTemplate = createCommentTemplate(commentsList);

  return `<section class='film-details'>
            <form class='film-details__inner' action='' method='get'>
              <div class='film-details__top-container'>
                <div class='film-details__close'>
                  <button class='film-details__close-btn' type='button'>close</button>
                </div>
                <div class='film-details__info-wrap'>
                  <div class='film-details__poster'>
                    <img class='film-details__poster-img' src="${poster}" alt="${title}">
                    <p class='film-details__age'>${ageRating}+</p>
                  </div>
                  <div class='film-details__info'>
                    <div class='film-details__info-head'>
                      <div class='film-details__title-wrap'>
                        <h3 class='film-details__title'>${title}</h3>
                        <p class='film-details__title-original'>Original: ${alternativeTitle}</p>
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
                        <td class='film-details__cell'>${writers.join(', ')}</td>
                      </tr>
                      <tr class='film-details__row'>
                        <td class='film-details__term'>Actors</td>
                        <td class='film-details__cell'>${actors.join(', ')}</td>
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
                        <td class='film-details__cell'>${releaseCountry}</td>
                      </tr>
                      <tr class='film-details__row'>
                        <td class='film-details__term'>${genre.length === 1 ? 'Genre' : 'Genres'}</td>
                        <td class='film-details__cell'>
                          <span class='film-details__genre'>${genre.join(', ')}</span>
                      </tr>
                    </table>
                    <p class='film-details__film-description'>${description}</p>
                  </div>
                </div>
                <section class='film-details__controls'>
                  <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist"
                  data-control="${MovieCardButtons.WATCH_LIST}" ${isWatchList ? 'checked' : ''}>
                  <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

                  <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched"
                  data-control="${MovieCardButtons.WATCHED}" ${isHistory ? 'checked' : ''}>
                  <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

                  <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite"
                  data-control="${MovieCardButtons.FAVORITE}" ${isFavorite ? 'checked' : ''}>
                  <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
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
                      ${isEmojiChecked ? `<img src="images/emoji/${checkedEmoji}.png" width="55" height="55" alt="emoji-${checkedEmoji}">` : ''}
                    </div>
                    <label class='film-details__comment-label'>
                      <textarea class='film-details__comment-input' placeholder='Select reaction below and write comment here' name='comment'>${commentText ? he.encode(commentText) : ''}</textarea>
                    </label>
                    <div class='film-details__emoji-list'>
                      ${createEmojiListTemplate(checkedEmoji)}
                    </div>
                  </div>
                </section>
              </div>
            </form>
          </section>`;
};

export default class Popup extends SmartView {
  constructor(movie, comments) {
    super();

    this._data = movie;
    this._comments = comments;
    this._element = null;

    this._handleClosePopup = this._handleClosePopup.bind(this);
    this._handleChangeControls = this._handleChangeControls.bind(this);
    this._handleEmojiChange = this._handleEmojiChange.bind(this);
  }

  getTemplate() {
    return createPopupTemplate(this._data, this._comments);
  }

  restoreHandlers() {
    this.setClosePopupHandler(this._callback.click);
    this.setControlsChangeHandler(this._callback.controlsChange);
    this.setEmojiChangeHandler();
  }

  _handleEmojiChange(evt) {
    if (evt.target.tagName === 'INPUT') {
      evt.preventDefault();

      this.updateData({
        isEmojiChecked: true,
        checkedEmoji: evt.target.value,
        commentText: this.getElement().querySelector('.film-details__comment-input').value,
      });
    }
  }

  _handleClosePopup(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  _handleChangeControls(evt) {
    if (evt.target.dataset.control) {
      evt.preventDefault();
      this._callback.controlsChange(evt.target.dataset.control);
    }
  }

  setClosePopupHandler(callback) {
    this._callback.click = callback;
    this.getElement()
      .querySelector('.film-details__close-btn')
      .addEventListener('click', this._handleClosePopup);
  }

  setControlsChangeHandler(callback) {
    this._callback.controlsChange = callback;
    this.getElement()
      .querySelector('.film-details__controls')
      .addEventListener('change', this._handleChangeControls);
  }

  setEmojiChangeHandler() {
    this.getElement()
      .querySelector('.film-details__emoji-list')
      .addEventListener('change', this._handleEmojiChange);
  }
}
