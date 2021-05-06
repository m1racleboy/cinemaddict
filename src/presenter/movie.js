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

    this._handleWatchListClick = this._handleWatchListClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoritesClick = this._handleFavoritesClick.bind(this);
  }

  init(movie) {
    this._movie = movie;
    const prevMovieCardComponent = this._movieCardComponent;
    const prevPopupComponent = this._popupComponent;

    this._movieCardComponent = new MovieCardView(movie);
    this._popupComponent = new PopupView(movie);

    this._movieCardComponent.setOpenPopupHandler(this._handleOpenPopupClick);
    this._movieCardComponent.setWatchListClickHandler(this._handleWatchListClick);
    this._movieCardComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._movieCardComponent.setFavoritesClickHandler(this._handleFavoritesClick);

    this._popupComponent.setClosePopupHandler(this._handleClosePopupClick);
    this._popupComponent.setWatchListClickHandler(this._handleWatchListClick);
    this._popupComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._popupComponent.setFavoritesClickHandler(this._handleFavoritesClick);

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
    siteBodyElement.classList.add('hide-overflow');
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

  _handleWatchListClick() {
    this._changeData({
      ...this._movie,
      user_details: {
        ...this._movie.user_details,
        isWatchList: !this._movie.user_details.isWatchList,
      },
    });
  }

  _handleWatchedClick() {
    this._changeData({
      ...this._movie,
      user_details: {
        ...this._movie.user_details,
        isHistory: !this._movie.user_details.isHistory,
      },
    });
  }

  _handleFavoritesClick() {
    this._changeData({
      ...this._movie,
      user_details: {
        ...this._movie.user_details,
        isFavorite: !this._movie.user_details.isFavorite,
      },
    });
  }
}
