import dayjs from 'dayjs';
import { createElement } from '../utils/common.js';

const createCommentTemplate = (comments) => {
  return Object.values(comments).map(({ author, comment, date, emotion }) => `
    <li class='film-details__comment'>
      <span class='film-details__comment-emoji'>
        <img src='./images/emoji/${emotion}.png' width='55' height='55' alt='emoji-${emotion}'>
      </span>
      <div>
        <p class='film-details__comment-text'>${comment}</p>
        <p class='film-details__comment-info'>
          <span class='film-details__comment-author'>${author}</span>
          <span class='film-details__comment-day'>${dayjs(date).format('DD MM YY')}</span>
          <button class='film-details__comment-delete'>Delete</button>
        </p>
      </div>
    </li>
  `).join('');
};

export default class Comment {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createCommentTemplate();
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
