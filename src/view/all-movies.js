import { createElement } from '../utils/common.js';

const createAllMoviesTemplate = () => {
  return `<section class="films-list">
            <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
            <div class="films-list__container"></div>
          </section>
  `;
};

export default class AllMovies {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createAllMoviesTemplate();
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
