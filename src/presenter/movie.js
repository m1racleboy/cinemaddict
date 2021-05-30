import dayjs from 'dayjs';
import MovieCardView from '../view/movie-card.js';
import PopupView from '../view/popup.js';

import CommentsModel from '../model/comment.js';

import { siteBodyElement } from '../main.js';

import { UpdateType, MovieCardButtons } from '../const.js';
import { render, RenderPosition, replace, remove, openPopup } from '../utils/render.js';

const ESCAPE_KEY = 'Escape';

const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP',
};

export default class Movie {
  constructor(container, changeData, changeMode, api) {
    this._container = container;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._commentsModel = new CommentsModel();

    this._api = api;

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
      this._handleClickControls(control);
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
    this._popupComponent = new PopupView(this._movie, this._comments);

    this._popupComponent.setClosePopupHandler(this._handleClosePopupClick);

    this._popupComponent.setControlsChangeHandler((control) => {
      this._handleClickControls(control);
    });

    this._popupComponent.setDeleteCommentClickHandler((commentId) => {
      this._popupComponent.setState({ deletingCommentId: commentId });

      return this._api.deleteComment(commentId)
        .then(() => {
          this._handleDeleteCommentClick(commentId);
        });
    });

    this._popupComponent.setAddCommentHandler((comment) => {
      this._popupComponent.setState({ isAddingComment: true });

      return this._api.addComment(comment, this._movie.id)
        .then((comment) => {
          this._handleAddComment(comment);
        });
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
    this._api.getComments(this._movie.id)
      .then((comments) => {
        this._commentsModel.setComments(comments);
        this._comments = this._commentsModel.getComments().slice();
        this._openPopup();
      })
      .catch(() => {
        this._comments = [];
        this._openPopup();
      });
  }

  _handleClosePopupClick() {
    this._closePopup();
  }

  _handleClickControls(control) {
    const userDetails = Object.assign(this._movie.userDetails);
    userDetails[control] = !userDetails[control];

    if (control === MovieCardButtons.WATCHED) {
      userDetails.watchingDate = userDetails.isHistory ? dayjs().format() : null;
    }

    const updatedMovie = Object.assign({}, this._movie, { userDetails: userDetails });

    if (this._mode === Mode.POPUP) {
      this._changeData(UpdateType.PATCH, updatedMovie);
      this._popupComponent.updateData({ userDetails });
      return;
    }
    else {
      this._changeData(UpdateType.MINOR, updatedMovie);
      return;
    }
  }

  _handleDeleteCommentClick(commentId) {
    const comments = this._movie.comments.filter((existedId) => String(existedId) !== String(commentId));
    const updatedMovie = Object.assign({}, this._movie, { comments });

    this._changeData(UpdateType.PATCH, updatedMovie);

    this._popupComponent.updateData({ comments });
  }

  _handleAddComment(comment) {
    const comments = this._movie.comments;
    comments.push(comment.id);

    const updatedMovie = Object.assign({}, this._movie, { comments });

    this._commentsModel.addComment(comment);
    this._changeData(UpdateType.PATCH, updatedMovie);

    this._popupComponent.updateComments(this._commentsModel.getComments().slice());
    this._popupComponent.updateData({ comments });
  }
}

