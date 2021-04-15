import { renderMovie } from './mock/movie.js';
import { createUserRankTemplate } from './view/user-rank.js';
import { createFooterStatsTemplate } from './view/footer-stats.js';
import { createMainNavigationTemplate } from './view/main-navigation.js';
import { createSortTemplate } from './view/sort.js';
import { createMoviesTemplate } from './view/movies.js';
import { createMovieCardTemplate } from './view/movie-card.js';
import { createShowMoreButtonTemplate } from './view/show-more-button.js';

const MOVIES_COUNT = 20;
const TOP_MOVIES_COUNT = 2;
const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterStatsElement = document.querySelector('.footer__statistics');

const movies = new Array(MOVIES_COUNT).fill().map((arr, i) => renderMovie(i));

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const renderFilmsCard = () => {
  for (let i = 0; i < MOVIES_COUNT; i++) {
    render(allMoviesList, createMovieCardTemplate(movies[i]), 'beforeend');
  }
};

const renderTopFilmsCard = () => {
  for (let i = 0; i < TOP_MOVIES_COUNT; i++) {
    render(topRatedFilmsList, createMovieCardTemplate(), 'beforeend');
  }
};

const renderMostCommentedFilmsCard = () => {
  for (let i = 0; i < TOP_MOVIES_COUNT; i++) {
    render(mostCommentedFilmsList, createMovieCardTemplate(), 'beforeend');
  }
};

render(siteHeaderElement, createUserRankTemplate(), 'beforeend');
render(siteMainElement, createMainNavigationTemplate(), 'beforeend');
render(siteMainElement, createSortTemplate(), 'beforeend');
render(siteMainElement, createMoviesTemplate(), 'beforeend');

const films = document.querySelector('.films');
const allMoviesList = films.querySelector('.films-list__container');

renderFilmsCard();

const topRatedFilmsList = films.querySelector('.films-list--extra > .films-list__container');

renderTopFilmsCard();

const mostCommentedFilmsList = films.querySelector('.films-list--extra:last-child > .films-list__container');

renderMostCommentedFilmsCard();

const filmsListElement = films.querySelector('.films-list');

render(filmsListElement, createShowMoreButtonTemplate(), 'beforeend');
render(siteFooterStatsElement, createFooterStatsTemplate(), 'beforeend');
