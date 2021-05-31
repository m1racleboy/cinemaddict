import dayjs from 'dayjs';
import he from 'he';

import SmartView from './smart.js';

import { getComments, addNewComment, humanizeCommentDate } from '../utils/comment.js';
import { getDuration } from '../utils/stats.js';
import { EMOJIS, MovieCardButtons } from '../const.js';

const SHAKE_ANIMATION_TIMEOUT = 444;
const ENTER_KEY = 'Enter';

const createCommentTemplate = (comments, deletingCommentId) => {
  comments.sort((a, b) => {
    const date1 = dayjs(a.date);
    const date2 = dayjs(b.date);

    return date1.diff(date2);
  });

  return comments.map(({ id, author, comment, date, emotion }) =>
    `<li class='film-details__comment' data-comment-id="${id}">
      <span class='film-details__comment-emoji'>
        <img src='./images/emoji/${emotion}.png' width='55' height='55' alt='emoji-${emotion}'>
      </span>
      <div>
        <p class='film-details__comment-text'>${he.encode(comment)}</p>
        <p class='film-details__comment-info'>
          <span class='film-details__comment-author'>${author}</span>
          <span class='film-details__comment-day'>${humanizeCommentDate(date)}</span>
          <button type='button' class='film-details__comment-delete' data-button-delete="${MovieCardButtons.DELETE}" data-comment-id="${id}"
          ${deletingCommentId === id ? 'disabled' : ''}>
          ${deletingCommentId === id ? 'Deleting...' : 'Delete'}
          </button>
        </p>
      </div>
     </li>
  `).join('');
};

const createEmojiListTemplate = (checkedEmoji, isAddingComment) => {
  return EMOJIS.map((emoji) => `<input class='film-details__emoji-item visually-hidden' name='comment-emoji' type='radio' id='emoji-${emoji}'
                                  value='${emoji}' ${emoji === checkedEmoji ? 'checked' : ''}  ${isAddingComment ? 'disabled' : ''}>
                                <label class='film-details__emoji-label' for='emoji-${emoji}'>
                                  <img src='./images/emoji/${emoji}.png' width='30' height='30' alt='emoji'>
                                </label>`).join('');
};

const createPopupTemplate = (movie, allComments, newComment, states) => {
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
  } = movie;

  const { isAddingComment, deletingCommentId } = states;

  const { isEmojiChecked, checkedEmoji, commentText } = newComment;

  const commentsCount = comments.length;
  const commentsList = getComments(comments, allComments);
  const commentsTemplate = createCommentTemplate(commentsList, deletingCommentId);

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
                      <textarea class='film-details__comment-input' placeholder='Select reaction below and write comment here' name='comment'
                      ${isAddingComment ? 'disabled' : ''}>${commentText ? he.encode(commentText) : ''}</textarea>
                    </label>
                    <div class='film-details__emoji-list'>
                      ${createEmojiListTemplate(checkedEmoji, isAddingComment)}
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

    this._newComment = {
      isEmojiChecked: false,
      checkedEmoji: null,
      commentText: '',
    };

    this._states = {
      isAddingComment: false,
      deletingCommentId: null,
    };

    this._handleClosePopup = this._handleClosePopup.bind(this);
    this._handleChangeControls = this._handleChangeControls.bind(this);
    this._handleChangeEmoji = this._handleChangeEmoji.bind(this);
    this._handleDeleteComment = this._handleDeleteComment.bind(this);
    this._handleAddComment = this._handleAddComment.bind(this);
  }

  getTemplate() {
    return createPopupTemplate(this._data, this._comments, this._newComment, this._states);
  }

  restoreHandlers() {
    this.setClosePopupHandler(this._callback.click);
    this.setControlsChangeHandler(this._callback.controlsChange);
    this.setDeleteCommentClickHandler(this._callback.deleteCommentClick);
    this.setAddCommentHandler(this._callback.addComment);
    this.setEmojiChangeHandler();
  }

  updateComments(comments) {
    this._comments = comments;
  }

  setState({ isAddingComment = false, deletingCommentId = null } = {}) {
    const scrollTop = this.getElement().scrollTop;

    this._states = {
      isAddingComment,
      deletingCommentId,
    };

    this.updateElement();

    this.getElement().scrollTop = scrollTop;
  }

  _shake(callback, element) {
    element.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      element.style.animation = '';
      callback();
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  _resetNewComment() {
    this._newComment = {
      isEmojiChecked: false,
      checkedEmoji: null,
      commentText: '',
    };
  }

  _handleChangeEmoji(evt) {
    if (evt.target.tagName === 'INPUT') {
      const scrollTop = this.getElement().scrollTop;

      evt.preventDefault();

      this._newComment.isEmojiChecked = true;
      this._newComment.checkedEmoji = evt.target.value;
      this._newComment.commentText = this.getElement().querySelector('.film-details__comment-input').value;

      this.updateElement();
      this.getElement().scrollTop = scrollTop;
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

  _handleDeleteComment(evt) {
    if (evt.target.dataset.buttonDelete === MovieCardButtons.DELETE) {
      evt.preventDefault();

      const scrollTop = this.getElement().scrollTop;

      this._callback.deleteCommentClick(evt.target.dataset.commentId)
        .then(() => {
          this.getElement().scrollTop = scrollTop;
          this.setState({ deletingCommentId: null });
        })
        .catch(() => {
          this._shake(() => {
            this.getElement().scrollTop = scrollTop;
            this.setState({ deletingCommentId: null });
          }, this.getElement().querySelector(`.film-details__comment[data-comment-id="${evt.target.dataset.commentId}"]`));
        });
    }
  }

  _handleAddComment(evt) {
    if ((evt.ctrlKey || evt.metaKey) && evt.code === ENTER_KEY) {
      const commentData = new FormData(this._element.querySelector('.film-details__inner'));

      if (commentData.get('comment') && commentData.get('comment-emoji')) {
        const comment = addNewComment(commentData);
        const scrollTop = this.getElement().scrollTop;

        this._newComment.commentText = this.getElement().querySelector('.film-details__comment-input').value;

        this._callback.addComment(comment)
          .then(() => {
            this._resetNewComment();
            this.getElement().scrollTop = scrollTop;
            this.setState({ isAddingComment: false });
          })
          .catch(() => {
            this._shake(() => {
              this.getElement().scrollTop = scrollTop;
              this.setState({ isAddingComment: false });
            }, this.getElement().querySelector('.film-details__inner'));
          });
      }
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
      .addEventListener('change', this._handleChangeEmoji);
  }

  setDeleteCommentClickHandler(callback) {
    this._callback.deleteCommentClick = callback;
    this.getElement()
      .querySelector('.film-details__comments-list')
      .addEventListener('click', this._handleDeleteComment);
  }

  setAddCommentHandler(callback) {
    this._callback.addComment = callback;
    this.getElement()
      .querySelector('.film-details__comment-input')
      .addEventListener('keydown', this._handleAddComment);
  }
}
