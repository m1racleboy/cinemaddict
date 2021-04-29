import AbstractView from './abstract.js';

const createFilterItemTemplate = (filters) => {
  const { name, count } = filters;
  String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };
  if (name === 'all') {
    return `<a href="#${name}" class="main-navigation__item main-navigation__item--active">${name.capitalize()} movies</a>`;
  }
  return `<a href="#${name}" class="main-navigation__item">${name.capitalize()} <span class="main-navigation__item-count">${count}</span></a>`;
};

const createFilterTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter))
    .join('');

  return `<nav class="main-navigation">
            <div class="main-navigation__items">
              ${filterItemsTemplate}
            </div>
            <a href="#stats" class="main-navigation__additional">Stats</a>
          </nav>`;
};

export default class FilterList extends AbstractView {
  constructor(filter) {
    super();
    this._filter = filter;
    this._element = null;
  }

  getTemplate() {
    return createFilterTemplate(this._filter);
  }
}
