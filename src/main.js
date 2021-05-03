import UserRankView from './view/user-rank.js';
import FooterStatsView from './view/footer-stats.js';
import FilterListView from './view/filter-list.js';
import SortListView from './view/sort-list.js';
import MoviesBoardView from './view/movies-board.js';
import TopMoviesView from './view/top-movies.js';
import MostCommentedMoviesView from './view/most-commented-movies.js';
import AllMoviesView from './view/all-movies.js';
import NoMovieView from './view/no-movies.js';
import MovieCardView from './view/movie-card.js';
import ShowMoreButtonView from './view/show-more-button.js';
import PopupView from './view/popup.js';
import { createMovieMock } from './mock/movie.js';
import { createFilter } from './mock/filter.js';
import { render, RenderPosition, replace, remove } from './utils/render.js';
import { Sort } from './const.js';

const MOVIES_COUNT = 20;
const MOVIES_COUNT_PER_STEP = 5;
const TOP_MOVIES_COUNT = 2;
const ESCAPE_KEY = 'Escape';
const siteBodyElement = document.querySelector('body');
const siteMainElement = siteBodyElement.querySelector('.main');
const siteHeaderElement = siteBodyElement.querySelector('.header');
const siteFooterStatsElement = siteBodyElement.querySelector('.footer__statistics');

const movies = new Array(MOVIES_COUNT).fill().map((arr, i) => createMovieMock(i));
const filters = createFilter(movies);
const renderMovie = (movieListElement, movie) => {
  const movieCardComponent = new MovieCardView(movie);
  const popupComponent = new PopupView(movie);

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

  render(movieListElement, movieCardComponent, RenderPosition.BEFOREEND);
};

const renderBoard = (boardContainer, boardMovies) => {
  const boardComponent = new MoviesBoardView();
  const moviesListComponent = new AllMoviesView();

  const renderMoviesCards = () => {
    boardMovies
      .slice(0, Math.min(movies.length, MOVIES_COUNT_PER_STEP))
      .forEach((boardMovie) => renderMovie(allMoviesList, boardMovie));
  };

  const renderTopMoviesCards = () => {
    const topMoviesListComponent = new TopMoviesView();
    render(boardComponent, topMoviesListComponent, RenderPosition.BEFOREEND);
    const topMoviesList = topMoviesListComponent.getElement().querySelector('.films-list--top > .films-list__container');
    boardMovies
      .slice(0, TOP_MOVIES_COUNT)
      .forEach((boardMovie) => renderMovie(topMoviesList, boardMovie));
  };

  const renderMostCommentedMoviesCards = () => {
    const mostCommentedMoviesListComponent = new MostCommentedMoviesView();
    render(boardComponent, mostCommentedMoviesListComponent, RenderPosition.BEFOREEND);
    const mostCommentedMoviesList = mostCommentedMoviesListComponent.getElement().querySelector('.films-list--most-commented > .films-list__container');

    boardMovies
      .slice(0, TOP_MOVIES_COUNT)
      .forEach((boardMovie) => renderMovie(mostCommentedMoviesList, boardMovie));
  };

  render(boardContainer, boardComponent, RenderPosition.BEFOREEND);
  render(boardComponent, moviesListComponent, RenderPosition.BEFOREEND);
  const allMoviesList = siteMainElement.querySelector('.films-list__container');

  if (boardMovies.length === 0) {
    render(boardComponent, new NoMovieView(), RenderPosition.AFTERBEGIN);
    return;
  }

  if (movies.length > MOVIES_COUNT_PER_STEP) {
    let renderedTaskCount = MOVIES_COUNT_PER_STEP;
    const showMoreButtonComponent = new ShowMoreButtonView();
    render(moviesListComponent, showMoreButtonComponent, RenderPosition.BEFOREEND);

    const showMoreHandler = () => {
      movies
        .slice(renderedTaskCount, renderedTaskCount + MOVIES_COUNT_PER_STEP)
        .forEach((movie) => renderMovie(allMoviesList, movie));

      renderedTaskCount += MOVIES_COUNT_PER_STEP;

      if (renderedTaskCount >= movies.length) {
        remove(showMoreButtonComponent);
      }
    };

    showMoreButtonComponent.setClickHandler(showMoreHandler);
  }

  renderMoviesCards();
  renderTopMoviesCards();
  renderMostCommentedMoviesCards();
};

render(siteHeaderElement, new UserRankView(movies), RenderPosition.BEFOREEND);
render(siteMainElement, new FilterListView(filters), RenderPosition.BEFOREEND);
render(siteMainElement, new SortListView(Sort), RenderPosition.BEFOREEND);
render(siteFooterStatsElement, new FooterStatsView(movies.length), RenderPosition.BEFOREEND);
renderBoard(siteMainElement, movies);
