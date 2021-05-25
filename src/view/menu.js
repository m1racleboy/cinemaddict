import AbstractView from './abstract.js';
import { CLASS_NAVIGATION_ACTIVE } from '../const.js';

const createMenuTemplate = () => {
  return `<nav class="main-navigation">
            <a href="#stats" class="main-navigation__additional">Stats</a>
          </nav>`;
};

export default class Menu extends AbstractView {
  constructor() {
    super();

    this._statsClickHandler = this._statsClickHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate();
  }

  removeActiveClass() {
    this.getElement()
      .querySelector('.main-navigation__additional')
      .classList.remove(CLASS_NAVIGATION_ACTIVE);
  }

  _statsClickHandler(evt) {
    evt.preventDefault();
    this._callback.statsClick();
    evt.target.classList.add(CLASS_NAVIGATION_ACTIVE);
  }

  setStatsClickHandler(callback) {
    this._callback.statsClick = callback;
    this.getElement()
      .querySelector('.main-navigation__additional')
      .addEventListener('click', this._statsClickHandler);
  }
}
