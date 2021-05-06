import MoviesBoardView from '../view/movies-board.js';
import SortListView from '../view/sort-list.js';
import AllMoviesView from '../view/all-movies.js';
import NoMovieView from '../view/no-movies.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import { Sort } from '../const.js';
import { sortMoviesByRating, sortMoviesByDate } from '../utils/movie.js';
import { render, RenderPosition, remove } from '../utils/render.js';
import { updateItem } from '../utils/common.js';
import MoviePresenter from './movie.js';

const MOVIES_COUNT_PER_STEP = 5;

export default class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._renderedMoviesCount = MOVIES_COUNT_PER_STEP;
    this._moviePresenter = {};
    this._currentSortType = Sort.DEFAULT;

    this._boardComponent = new MoviesBoardView();
    this._sortComponent = new SortListView(Sort);
    this._allMoviesComponent = new AllMoviesView();
    this._noMoviesComponent = new NoMovieView();
    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleMovieChange = this._handleMovieChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(movies) {
    this._movies = movies.slice();
    this._sourcedMovies = movies.slice();

    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);
    render(this._boardComponent, this._allMoviesComponent, RenderPosition.BEFOREEND);

    this._allMoviesContainer = this._boardComponent.getElement().querySelector('.films-list__container');

    this._renderBoard();
  }

  _handleModeChange() {
    Object
      .values(this._moviePresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleMovieChange(updatedMovie) {
    this._movies = updateItem(this._movies, updatedMovie);
    this._sourcedMovies = updateItem(this._sourcedMovies, updatedMovie);
    this._moviePresenter[updatedMovie.id].init(updatedMovie);
  }

  _sortMovies(sortType) {
    switch (sortType) {
      case Sort.DATE:
        this._movies.sort(sortMoviesByDate);
        break;
      case Sort.RATING:
        this._movies.sort(sortMoviesByRating);
        break;
      default:
        this._movies = this._sourcedMovies.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortMovies(sortType);
    this._clearMoviesList();
    this._renderMoviesList();
  }

  _renderSort() {
    render(this._boardContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderMovie(movie, container) {
    const moviePresenter = new MoviePresenter(container, this._handleMovieChange, this._handleModeChange);
    moviePresenter.init(movie);
    this._moviePresenter[movie.id] = moviePresenter;
  }

  _renderAllMovies(from, to) {
    this._movies
      .slice(from, to)
      .forEach((movie) => this._renderMovie(movie, this._allMoviesContainer));
  }

  _clearMoviesList() {
    Object
      .values(this._moviePresenter)
      .forEach((presenter) => presenter.destroy());
    this._moviePresenter = {};
    this._renderedMoviesCount = MOVIES_COUNT_PER_STEP;
    remove(this._showMoreButtonComponent);
  }

  _renderNoMovies() {
    render(this._boardComponent, this._noMoviesComponent, RenderPosition.AFTERBEGIN);
  }

  _handleShowMoreButtonClick() {
    this._renderAllMovies(this._renderedMoviesCount, this._renderedMoviesCount + MOVIES_COUNT_PER_STEP);

    this._renderedMoviesCount += MOVIES_COUNT_PER_STEP;

    if (this._renderedMoviesCount >= this._movies.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    render(this._allMoviesComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _renderMoviesList() {
    this._renderAllMovies(0, Math.min(this._movies.length, MOVIES_COUNT_PER_STEP));

    if (this._movies.length > MOVIES_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderBoard() {
    if (this._movies.length === 0) {
      this._renderNoMovies();
      return;
    }

    this._renderSort();

    this._renderMoviesList();
  }
}
