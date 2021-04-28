import { createElement } from '../utils/common.js';

const createSortItemTemplate = (sorts) => {
  let sortButtonActive = '';
  if (sorts.default) {
    sortButtonActive = 'sort__button--active';
  }
  return `<li><a href="#" class="sort__button ${sortButtonActive}">${Object.values(sorts)}</a></li>`;
};

const createSortTemplate = (sortItems) => {
  const sortItemsTemplate = sortItems
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
