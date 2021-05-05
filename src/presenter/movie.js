import MovieCardView from '../view/movie-card.js';
import PopupView from '../view/popup.js';
import { siteBodyElement } from '../main.js';
import { render, RenderPosition, replace, remove, openPopup } from '../utils/render.js';

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

    this._movieCardComponent.setOpenPopupHandler(this._handleOpenPopupClick);
    this._popupComponent.setClosePopupHandler(this._handleClosePopupClick);

    if (prevMovieCardComponent === null || prevPopupComponent === null) {
      render(this._container, this._movieCardComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._container.contains(prevMovieCardComponent.getElement())) {
      replace(this._movieCardComponent, prevMovieCardComponent);
    }

    if (siteBodyElement.contains(prevPopupComponent.getElement())) {
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
    openPopup(this._popupComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  _replacePopupToCard() {
    this._popupComponent.getElement().remove();
    document.removeEventListener('keydown', this._escKeyDownHandler);
    siteBodyElement.classList.remove('hide-overflow');
  }

  _escKeyDownHandler(evt) {
    if (evt.key === ESCAPE_KEY) {
      evt.preventDefault();
      this._replacePopupToCard();
    }
  }

  _handleOpenPopupClick() {
    const popup = siteBodyElement.querySelector('.film-details');
    if (siteBodyElement.contains(popup)) {
      popup.remove();
    }
    this._replaceCardToPopup();
  }

  _handleClosePopupClick() {
    this._replacePopupToCard();
  }
}
