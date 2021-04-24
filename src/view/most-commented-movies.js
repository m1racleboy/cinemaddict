import { createElement } from '../utils/common.js';

const createMostCommentedMoviesTemplate = () => {
  return `<section class="films-list films-list--extra films-list--most-commented">
            <h2 class="films-list__title">Most commented</h2>
            <div class="films-list__container"></div>
          </section>`;
};

export default class MostCommentedMovies {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createMostCommentedMoviesTemplate();
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