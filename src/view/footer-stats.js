import AbstractView from './abstract.js';

const createFooterStatsTemplate = (moviesCount) => {
  return `<p>${moviesCount} movies inside</p>`;
};


export default class FooterStats extends AbstractView {
  constructor(moviesCount) {
    super();
    this._moviesCount = moviesCount;
    this._element = null;
  }

  getTemplate() {
    return createFooterStatsTemplate(this._moviesCount);
  }
}
