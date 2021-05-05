import MoviesBoardView from '../view/movies-board.js';
import SortListView from '../view/sort-list.js';
import TopMoviesView from '../view/top-movies.js';
import MostCommentedMoviesView from '../view/most-commented-movies.js';
import AllMoviesView from '../view/all-movies.js';
import NoMovieView from '../view/no-movies.js';
import MovieCardView from '../view/movie-card.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import PopupView from '../view/popup.js';
import { Sort } from '../const.js';
import { render, RenderPosition, replace, remove } from '../utils/render.js';
import { siteBodyElement } from '../main.js';

const MOVIES_COUNT_PER_STEP = 5;
const TOP_MOVIES_COUNT = 2;
const ESCAPE_KEY = 'Escape';

export default class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._boardComponent = new MoviesBoardView();
    this._sortComponent = new SortListView(Sort);
    this._allMoviesComponent = new AllMoviesView();
    this._topMoviesComponent = new TopMoviesView();
    this._mostCommentedMoviesComponent = new MostCommentedMoviesView();
    this._noMoviesComponent = new NoMovieView();
  }

  init(movies) {
    this._movies = movies.slice();

    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);
    render(this._boardComponent, this._allMoviesComponent, RenderPosition.BEFOREEND);

    this._renderBoard();
  }

  _renderSort() {
    render(this._boardContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderMovie(movie) {
    const movieCardComponent = new MovieCardView(movie);
    const popupComponent = new PopupView(movie);
    const moviesContainer = this._boardComponent.getElement().querySelector('.films-list__container');
    const replaceCardToPopup = () => {
      replace(popupComponent, movieCardComponent);
    };

    const replacePopupToCard = () => {
      replace(movieCardComponent, popupComponent);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === ESCAPE_KEY) {
        evt.preventDefault();
        replacePopupToCard();
        document.removeEventListener('keydown', onEscKeyDown);
        siteBodyElement.classList.remove('hide-overflow');
      }
    };

    movieCardComponent.setClickHandler(() => {
      siteBodyElement.classList.add('hide-overflow');
      replaceCardToPopup();
      document.addEventListener('keydown', onEscKeyDown);
    });

    movieCardComponent.setClickHandler(() => {
      siteBodyElement.classList.add('hide-overflow');
      replaceCardToPopup();
      document.addEventListener('keydown', onEscKeyDown);
    });

    movieCardComponent.setClickHandler(() => {
      siteBodyElement.classList.add('hide-overflow');
      replaceCardToPopup();
      document.addEventListener('keydown', onEscKeyDown);
    });

    popupComponent.setClickHandler(() => {
      siteBodyElement.classList.remove('hide-overflow');
      replacePopupToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(moviesContainer, movieCardComponent, RenderPosition.BEFOREEND);
  }

  _renderMovies(from, to) {
    this._movies
      .slice(from, to)
      .forEach((movie) => this._renderMovie(movie));
  }

  _renderMoviesTop() {

  }

  _renderMoviesMostCommented() {

  }

  _renderNoMovies() {
    render(this._boardComponent, this._noMoviesComponent, RenderPosition.AFTERBEGIN);
  }

  _renderShowMoreButton() {
    let renderedTaskCount = MOVIES_COUNT_PER_STEP;
    const showMoreButtonComponent = new ShowMoreButtonView();
    render(this._allMoviesComponent, showMoreButtonComponent, RenderPosition.BEFOREEND);

    const showMoreHandler = () => {
      this._movies
        .slice(renderedTaskCount, renderedTaskCount + MOVIES_COUNT_PER_STEP)
        .forEach((movie) => this._renderMovie(movie));

      renderedTaskCount += MOVIES_COUNT_PER_STEP;

      if (renderedTaskCount >= this._movies.length) {
        remove(showMoreButtonComponent);
      }
    };

    showMoreButtonComponent.setClickHandler(showMoreHandler);
  }

  _renderMoviesList() {
    this._renderMovies(0, Math.min(this._movies.length, MOVIES_COUNT_PER_STEP));

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
