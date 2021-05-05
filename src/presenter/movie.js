import MovieCardView from '../view/movie-card.js';
import PopupView from '../view/popup.js';
import { siteBodyElement } from '../main.js';
import { render, RenderPosition, replace, remove } from '../utils/render.js';

const ESCAPE_KEY = 'Escape';

export default class Movie {
  constructor(container, changeData) {
    this._container = container;
    this._changeData = changeData;

    this._movieCardComponent = null;
    this._popupComponent = null;

    this._handleOpenPopupClick = this._handleOpenPopupClick.bind(this);
    this._handleClosePopupClick = this._handleClosePopupClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(movie) {
    const prevMovieCardComponent = this._movieCardComponent;
    const prevPopupComponent = this._popupComponent;

    this._movieCardComponent = new MovieCardView(movie);
    this._popupComponent = new PopupView(movie);

    this._movieCardComponent.setClickHandler(this._handleOpenPopupClick);
    this._popupComponent.setClickHandler(this._handleClosePopupClick);

    if (prevMovieCardComponent === null || prevPopupComponent === null) {
      render(this._container, this._movieCardComponent, RenderPosition.BEFOREEND);
      return;
    }

    if(this._container.contains(prevMovieCardComponent.getElement())){
      replace(this._movieCardComponent, prevMovieCardComponent);
    }

    if(this._container.contains(prevPopupComponent.getElement())){
      replace(this._popupComponent, prevPopupComponent);
    }

    remove(prevMovieCardComponent);
    remove(prevPopupComponent);
  }

  destroy() {
    remove(this._movieCardComponent);
    remove(this._popupComponent);
  }

  _replaceCardToPopup() {
    replace(this._popupComponent, this._movieCardComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  _replacePopupToCard() {
    replace(this._movieCardComponent, this._popupComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === ESCAPE_KEY) {
      evt.preventDefault();
      this._replacePopupToCard();
      siteBodyElement.classList.remove('hide-overflow');
    }
  }

  _handleOpenPopupClick() {
    this._replaceCardToPopup();
  }

  _handleClosePopupClick() {
    this._replacePopupToCard();
  }
}
