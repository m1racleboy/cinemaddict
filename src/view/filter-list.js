import AbstractView from './abstract.js';
import { FilterType, CLASS_NAVIGATION_ACTIVE } from '../const';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const { type, name, count } = filter;

  return `<a href="#${type}"
            class="main-navigation__item ${type === currentFilterType ? CLASS_NAVIGATION_ACTIVE : ''}"
            data-type="${type}">
            ${name} ${type !== FilterType.ALL ? `<span class="main-navigation__item-count">${count}</span>` : ''}
          </a>`;
};

const createFilterTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return `<div class="main-navigation__items">
            ${filterItemsTemplate}
          </div>`;
};

export default class FilterList extends AbstractView {
  constructor(filter, currentFilterType) {
    super();
    this._filter = filter;
    this._currentFilter = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filter, this._currentFilter);
  }

  removeActiveClass() {
    const filterButtons = this.getElement().querySelectorAll('.main-navigation__item');

    for (let i = 0; i < filterButtons.length; i++) {
      filterButtons[i].classList.remove(CLASS_NAVIGATION_ACTIVE);
    }
  }

  _filterTypeChangeHandler(evt) {
    if (evt.target.dataset.type) {
      evt.preventDefault();
      this._callback.filterTypeChange(evt.target.dataset.type);
    }
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('click', this._filterTypeChangeHandler);
  }
}
