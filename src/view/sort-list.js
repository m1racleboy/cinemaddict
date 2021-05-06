import AbstractView from './abstract.js';
import { Sort } from '../const.js';

const createSortTemplate = () => {
  return `<ul class="sort">
            <li><a href="#" class="sort__button sort__button--active" data-sort-type="${Sort.DEFAULT}">Sort by default</a></li>
            <li><a href="#" class="sort__button" data-sort-type="${Sort.RATING}">Sort by rating</a></li>
            <li><a href="#" class="sort__button" data-sort-type="${Sort.DATE}">Sort by date</a></li>
          </ul>`;
};

export default class SortList extends AbstractView {
  constructor() {
    super();

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate();
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();

    const sortButtons = document.querySelectorAll('.sort__button');
    sortButtons.forEach((node) => node.classList.remove('sort__button--active'));

    this._callback.sortTypeChange(evt.target.dataset.sortType);

    evt.target.classList.add('sort__button--active');
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }
}
