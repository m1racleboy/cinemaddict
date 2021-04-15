import { createUserRankTemplate } from './view/user-rank.js';
import { createFooterStatsTemplate } from './view/footer-stats.js';
import { createMainNavigationTemplate } from './view/main-navigation.js';
import { createSortTemplate } from './view/sort.js';
import { createFilmsTemplate } from './view/films.js';
import { createFilmCardTemplate } from './view/film-card.js';
import { createShowMoreButtonTemplate } from './view/show-more-button.js';
import { renderMovie } from './mock/movie.js';

const FILM_CARD_COUNT = 5;
const TOP_FILM_CARD_COUNT = 2;
const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterStatsElement = document.querySelector('.footer__statistics');

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const renderFilmsCard = () => {
  for (let i = 0; i < FILM_CARD_COUNT; i++) {
    render(allMoviesList, createFilmCardTemplate(), 'beforeend');
  }
};

const renderTopFilmsCard = () => {
  for (let i = 0; i < TOP_FILM_CARD_COUNT; i++) {
    render(topRatedFilmsList, createFilmCardTemplate(), 'beforeend');
  }
};

const renderMostCommentedFilmsCard = () => {
  for (let i = 0; i < TOP_FILM_CARD_COUNT; i++) {
    render(mostCommentedFilmsList, createFilmCardTemplate(), 'beforeend');
  }
};

render(siteHeaderElement, createUserRankTemplate(), 'beforeend');
render(siteMainElement, createMainNavigationTemplate(), 'beforeend');
render(siteMainElement, createSortTemplate(), 'beforeend');
render(siteMainElement, createFilmsTemplate(), 'beforeend');

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
