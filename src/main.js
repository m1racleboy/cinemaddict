import UserRankView from './view/user-rank.js';
import FooterStatsView from './view/footer-stats.js';
import FilterListView from './view/filter-list.js';
import SortView from './view/sort.js';
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
import { render, RenderPosition } from './utils/common.js';

const MOVIES_COUNT = 20;
const MOVIES_COUNT_PER_STEP = 5;
const TOP_MOVIES_COUNT = 2;
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
    movieListElement.replaceChild(popupComponent.getElement(), movieCardComponent.getElement());
  };

  const replacePopupToCard = () => {
    movieListElement.replaceChild(movieCardComponent.getElement(), popupComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replacePopupToCard();
      document.removeEventListener('keydown', onEscKeyDown);
      siteBodyElement.classList.remove('hide-overflow');
    }
  };

  movieCardComponent.getElement().querySelector('.film-card__poster').addEventListener('click', () => {
    siteBodyElement.classList.add('hide-overflow');
    replaceCardToPopup();
    document.addEventListener('keydown', onEscKeyDown);
  });

  movieCardComponent.getElement().querySelector('.film-card__title').addEventListener('click', () => {
    siteBodyElement.classList.add('hide-overflow');
    replaceCardToPopup();
    document.addEventListener('keydown', onEscKeyDown);
  });

  movieCardComponent.getElement().querySelector('.film-card__comments').addEventListener('click', () => {
    siteBodyElement.classList.add('hide-overflow');
    replaceCardToPopup();
    document.addEventListener('keydown', onEscKeyDown);
  });

  popupComponent.getElement().querySelector('.film-details__close-btn').addEventListener('click', () => {
    siteBodyElement.classList.remove('hide-overflow');
    replacePopupToCard();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  render(movieListElement, movieCardComponent.getElement(), RenderPosition.BEFOREEND);
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
    render(boardComponent.getElement(), topMoviesListComponent.getElement(), RenderPosition.BEFOREEND);
    const topMoviesList = topMoviesListComponent.getElement().querySelector('.films-list--top > .films-list__container');
    boardMovies
      .slice(0, TOP_MOVIES_COUNT)
      .forEach((boardMovie) => renderMovie(topMoviesList, boardMovie));
  };

  const renderMostCommentedMoviesCards = () => {
    const mostCommentedMoviesListComponent = new MostCommentedMoviesView();
    render(boardComponent.getElement(), mostCommentedMoviesListComponent.getElement(), RenderPosition.BEFOREEND);
    const mostCommentedMoviesList = mostCommentedMoviesListComponent.getElement().querySelector('.films-list--most-commented > .films-list__container');

    boardMovies
      .slice(0, TOP_MOVIES_COUNT)
      .forEach((boardMovie) => renderMovie(mostCommentedMoviesList, boardMovie));
  };

  render(boardContainer, boardComponent.getElement(), RenderPosition.BEFOREEND);
  render(boardComponent.getElement(), moviesListComponent.getElement(), RenderPosition.BEFOREEND);
  const allMoviesList = siteMainElement.querySelector('.films-list__container');

  if (boardMovies.length === 0) {
    render(boardComponent.getElement(), new NoMovieView().getElement(), RenderPosition.AFTERBEGIN);
    return;
  }

  if (movies.length > MOVIES_COUNT_PER_STEP) {
    let renderedTaskCount = MOVIES_COUNT_PER_STEP;
    const showMoreButtonComponent = new ShowMoreButtonView();
    render(moviesListComponent.getElement(), showMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

    const showMoreHandler = (evt) => {
      evt.preventDefault();

      movies
        .slice(renderedTaskCount, renderedTaskCount + MOVIES_COUNT_PER_STEP)
        .forEach((movie) => renderMovie(allMoviesList, movie));

      renderedTaskCount += MOVIES_COUNT_PER_STEP;

      if (renderedTaskCount >= movies.length) {
        showMoreButtonComponent.getElement().remove();
        showMoreButtonComponent.removeElement();
      }
    };

    showMoreButtonComponent.getElement().addEventListener('click', showMoreHandler);
  }

  renderMoviesCards();
  renderTopMoviesCards();
  renderMostCommentedMoviesCards();
};

render(siteHeaderElement, new UserRankView().getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new FilterListView(filters).getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new SortView().getElement(), RenderPosition.BEFOREEND);
render(siteFooterStatsElement, new FooterStatsView(movies.length).getElement(), RenderPosition.BEFOREEND);
renderBoard(siteMainElement, movies);
