import AbstractView from './abstract.js';
import { Sort } from '../const.js';

const createSortTemplate = (currentSortType) => {
  return `<ul class="sort">
            <li><a href="#" class="sort__button ${currentSortType === Sort.DEFAULT ? 'sort__button--active' : ''}" data-sort-type="${Sort.DEFAULT}">Sort by default</a></li>
            <li><a href="#" class="sort__button ${currentSortType === Sort.RATING ? 'sort__button--active' : ''}" data-sort-type="${Sort.RATING}">Sort by rating</a></li>
            <li><a href="#" class="sort__button ${currentSortType === Sort.DATE ? 'sort__button--active' : ''}" data-sort-type="${Sort.DATE}">Sort by date</a></li>
          </ul>`;
};

export default class SortList extends AbstractView {
  constructor(currentSortType) {
    super();

    this._currentSortType = currentSortType;

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate(this._currentSortType);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();

    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }
}
