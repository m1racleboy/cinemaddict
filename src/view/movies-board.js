import { createElement } from '../utils/common.js';

const createMoviesBoardTemplate = () => {
  return `
    <section class="films"></section>
  `;
};

export default class MoviesBoard {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createMoviesBoardTemplate();
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
