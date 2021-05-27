import MovieCardView from '../view/movie-card.js';
import PopupView from '../view/popup.js';
import { UserAction, UpdateType, PopupButtons } from '../const.js';
import { siteBodyElement } from '../main.js';
import { render, RenderPosition, replace, remove, openPopup } from '../utils/render.js';
import dayjs from 'dayjs';

const ESCAPE_KEY = 'Escape';

const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP',
};

export default class Movie {
  constructor(container, changeData, changeMode) {
    this._container = container;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._movieCardComponent = null;
    this._popupComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleOpenPopupClick = this._handleOpenPopupClick.bind(this);
    this._handleClosePopupClick = this._handleClosePopupClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(movie) {
    this._movie = movie;

    const prevMovieCardComponent = this._movieCardComponent;
    this._movieCardComponent = new MovieCardView(movie);

    this._movieCardComponent.setOpenPopupHandler(this._handleOpenPopupClick);
    this._movieCardComponent.setControlsClickHandler((control) => {
      this._handleClickControls(this._movie, control);
    });

    if (prevMovieCardComponent === null) {
      render(this._container, this._movieCardComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._container.contains(prevMovieCardComponent.getElement())) {
      replace(this._movieCardComponent, prevMovieCardComponent);
    }

    remove(prevMovieCardComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closePopup();
    }
  }

  destroy() {
    remove(this._movieCardComponent);
  }

  _openPopup() {
    this._changeMode();
    this._mode = Mode.POPUP;

    const prevPopupComponent = this._popupComponent;
    this._popupComponent = new PopupView(this._movie);

    this._popupComponent.setClosePopupHandler(this._handleClosePopupClick);
    this._popupComponent.setControlsChangeHandler((control) => {
      this._handleClickControls(this._movie, control);
    });
    this._popupComponent.setEmojiChangeHandler();

    if (prevPopupComponent === null) {
      openPopup(this._popupComponent);
      siteBodyElement.classList.add('hide-overflow');
      document.addEventListener('keydown', this._escKeyDownHandler);
      return;
    }

    if (this._mode === Mode.POPUP) {
      replace(this._popupComponent, prevPopupComponent);
      siteBodyElement.classList.add('hide-overflow');
      document.addEventListener('keydown', this._escKeyDownHandler);
    }

    remove(prevPopupComponent);
  }

  _closePopup() {
    this._popupComponent.getElement().remove();
    this._popupComponent = null;
    this._mode = Mode.DEFAULT;
    siteBodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === ESCAPE_KEY) {
      evt.preventDefault();
      this._closePopup();
    }
  }

  _handleOpenPopupClick() {
    this._openPopup();
  }

  _handleClosePopupClick() {
    this._closePopup();
  }

  _handleClickControls(movie, control) {
    const userDetails = Object.assign(movie.userDetails);
    userDetails[control] = !userDetails[control];


    if (control === PopupButtons.WATCHED) {
      userDetails.watchingDate = userDetails.isHistory ? dayjs().format() : null;
    }

    const updatedMovie = Object.assign({}, movie, { userDetails: userDetails });

    this._changeData(UserAction.UPDATE_MOVIE, UpdateType.MINOR, updatedMovie);
  }
}

