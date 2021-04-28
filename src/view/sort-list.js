import { createElement } from '../utils/common.js';

const createSortItemTemplate = (value) => {
  const DEFAULT_SORT_VALUE = 'Sort by default';
  const setActiveClass = value === DEFAULT_SORT_VALUE ? 'sort__button--active' : '';
  return `<li><a href="#" class="sort__button ${setActiveClass}">${value}</a></li>`;
};

const createSortTemplate = (sortItems) => {
  const sortItemsTemplate = Object.values(sortItems)
    .map((sort) => createSortItemTemplate(sort))
    .join('');

  return `<ul class="sort">
            ${sortItemsTemplate}
          </ul>`;
};

export default class SortList {
  constructor(sorts) {
    this._sorts = sorts;
    this._element = null;
  }

  getTemplate() {
    return createSortTemplate(this._sorts);
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
