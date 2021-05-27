import MoviesBoardView from '../view/movies-board.js';
import SortListView from '../view/sort-list.js';
import AllMoviesView from '../view/all-movies.js';
import NoMovieView from '../view/no-movies.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import UserRankView from '../view/user-rank.js';

import MoviePresenter from './movie.js';

import { filter } from '../utils/filter.js';
import { Sort, UpdateType, UserAction } from '../const.js';
import { sortMoviesByRating, sortMoviesByDate } from '../utils/movie.js';
import { render, RenderPosition, remove } from '../utils/render.js';
import { getUserRank } from '../utils/user-rank.js';

const MOVIES_COUNT_PER_STEP = 5;

export default class Board {
  constructor(boardContainer, moviesModel, filterModel, statsComponent, headerElement) {
    this._boardContainer = boardContainer;
    this._headerElement = headerElement;

    this._moviesModel = moviesModel;
    this._filterModel = filterModel;

    this._renderedMovieCount = MOVIES_COUNT_PER_STEP;
    this._moviePresenter = {};
    this._currentSortType = Sort.DEFAULT;

    this.isShown = true;

    this._sortComponent = null;
    this._showMoreButtonComponent = null;

    this._userRankComponent = new UserRankView(getUserRank(this._moviesModel.getMovies()));
    this._boardComponent = new MoviesBoardView();
    this._allMoviesComponent = new AllMoviesView();
    this._noMoviesComponent = new NoMovieView();
    this._statsComponent = statsComponent;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);
    render(this._boardComponent, this._allMoviesComponent, RenderPosition.BEFOREEND);

    this._allMoviesContainer = this._boardComponent.getElement().querySelector('.films-list__container');

    this._renderBoard();
  }

  show() {
    this._boardComponent.show();
    this._sortComponent.show();

    this.isShown = true;
  }

  hide() {
    this._boardComponent.hide();
    this._sortComponent.hide();

    this.isShown = false;
  }

  _getMovies() {
    const filterType = this._filterModel.getFilter();
    const movies = this._moviesModel.getMovies();
    const filteredMovies = filter[filterType](movies);

    switch (this._currentSortType) {
      case Sort.DATE:
        return filteredMovies.sort(sortMoviesByDate);
      case Sort.RATING:
        return filteredMovies.sort(sortMoviesByRating);
    }

    return filteredMovies;
  }

  _handleModeChange() {
    Object
      .values(this._moviePresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_MOVIE:
        this._moviesModel.updateMovie(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this._moviesModel.addComment(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this._moviesModel.deleteComment(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._moviePresenter[data.id].init(data);
        this._updateRating();
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderBoard();
        this._updateRating();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({ resetRenderedMovieCount: true, resetSortType: true });
        this._renderBoard();
        this._updateRating();
        break;
    }

    this._statsComponent.updateData({ movies: this._getMovies().filter((movie) => movie.userDetails.isHistory) });
  }

  _updateRating() {
    const userRank = getUserRank(this._moviesModel.getMovies());
    const newUserRank = new UserRankView(userRank);

    this._headerElement.replaceChild(newUserRank.getElement(), this._userRankComponent.getElement());

    this._userRankComponent = newUserRank;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearBoard({ resetRenderedTaskCount: true });
    this._renderBoard();
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortListView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._boardComponent, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderMovie(movie, container) {
    const moviePresenter = new MoviePresenter(container, this._handleViewAction, this._handleModeChange);
    moviePresenter.init(movie);
    this._moviePresenter[movie.id] = moviePresenter;
  }

  _renderAllMovies(movies) {
    movies.forEach((movie) => this._renderMovie(movie, this._allMoviesContainer));
  }

  _renderNoMovies() {
    render(this._boardComponent, this._noMoviesComponent, RenderPosition.AFTERBEGIN);
  }

  _handleShowMoreButtonClick() {
    const moviesCount = this._getMovies().length;
    const newRenderedMoviesCount = Math.min(moviesCount, this._renderedMovieCount + MOVIES_COUNT_PER_STEP);
    const movies = this._getMovies().slice(this._renderedMovieCount, newRenderedMoviesCount);

    this._renderAllMovies(movies);
    this._renderedMovieCount = newRenderedMoviesCount;

    if (this._renderedMovieCount >= moviesCount) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);

    render(this._allMoviesComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
  }

  _renderMoviesList() {
    const moviesCount = this._getMovies().length;
    const movies = this._getMovies().slice(0, Math.min(moviesCount, MOVIES_COUNT_PER_STEP));
    this._renderAllMovies(movies);

    if (moviesCount > MOVIES_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _clearBoard({ resetRenderedMovieCount = false, resetSortType = false } = {}) {
    const movieCount = this._getMovies().length;

    Object
      .values(this._moviePresenter)
      .forEach((presenter) => presenter.destroy());
    this._moviePresenter = {};

    remove(this._sortComponent);
    remove(this._noMoviesComponent);
    remove(this._showMoreButtonComponent);

    if (resetRenderedMovieCount) {
      this._renderedMovieCount = MOVIES_COUNT_PER_STEP;
    } else {
      this._renderedMovieCount = Math.min(movieCount, this._renderedMovieCount);
    }

    if (resetSortType) {
      this._currentSortType = Sort.DEFAULT;
    }
  }

  _renderBoard() {
    const movies = this._getMovies();
    const movieCount = movies.length;

    if (movieCount === 0) {
      this._renderNoMovies();
      return;
    }

    render(this._headerElement, this._userRankComponent, RenderPosition.BEFOREEND);

    this._renderSort();

    this._renderAllMovies(movies.slice(0, Math.min(movieCount, this._renderedMovieCount)));

    if (movieCount > this._renderedMovieCount) {
      this._renderShowMoreButton();
    }
  }
}
