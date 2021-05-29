import AbstractView from './abstract.js';

const createShowMoreButtonTemplate = () => {
  return '<button class="films-list__show-more">Show more</button>';
};

export default class ShowMoreButton extends AbstractView {
  constructor() {
    super();
    this._handleShowMoreClick = this._handleShowMoreClick.bind(this);
  }

  getTemplate() {
    return createShowMoreButtonTemplate();
  }

  _handleShowMoreClick(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().addEventListener('click', this._handleShowMoreClick);
  }
}
