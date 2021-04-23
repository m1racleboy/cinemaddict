import { createElement } from '../utils/common.js';

const createFooterStatsTemplate = (moviesCount) => {
  return `
    <p>${moviesCount} movies inside</p>
  `;
};


export default class FooterStats {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFooterStatsTemplate();
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
