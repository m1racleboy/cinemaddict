import { createElement } from '../utils/common.js';

const createSortItemTemplate = (sorts) => {
  const { name, current } = sorts;
  if (current) {
    return `<li><a href="#" class="sort__button sort__button--active">Sort by ${name}</a></li>`
  }
  else {
    return `<li><a href="#" class="sort__button">Sort by ${name}</a></li>`
  }
}

const createSortTemplate = (sortItems) => {
  const sortItemsTemplate = sortItems
    .map((sort) => createSortItemTemplate(sort))
    .join('');
  return `<ul class="sort">
            ${sortItemsTemplate}
          </ul>`;
};

export default class Sort {
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
