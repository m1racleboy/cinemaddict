import { createUserRankTemplate } from './view/user-rank.js';
import { createFooterStatsTemplate } from './view/footer-stats.js';
import { createMainNavigationTemplate } from './view/main-navigation.js';
import { createSortTemplate } from './view/sort.js';
import { createFilmsTemplate } from './view/films.js';
import { createFilmCardTemplate } from './view/film-card.js';
import { createShowMoreButtonTemplate } from './view/show-more-button.js';

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterStatsElement = document.querySelector('.footer__statistics');
const FILM_CARD_COUNT = 5;
const TOP_FILM_CARD_COUNT = 2;

render(siteHeaderElement, createUserRankTemplate(), 'beforeend');
render(siteMainElement, createMainNavigationTemplate(), 'beforeend');
render(siteMainElement, createSortTemplate(), 'beforeend');
render(siteMainElement, createFilmsTemplate(), 'beforeend');

const allMoviesList = document.querySelector('.films-list__container');

for (let i = 0; i < FILM_CARD_COUNT; i++) {
  render(allMoviesList, createFilmCardTemplate(), 'beforeend');
}

const filmsListElement = document.querySelector('.films-list');

render(filmsListElement, createShowMoreButtonTemplate(), 'beforeend');

const topRatedFilmsList = document.querySelector('.films-list--extra > .films-list__container');

for (let i = 0; i < TOP_FILM_CARD_COUNT; i++) {
  render(topRatedFilmsList, createFilmCardTemplate(), 'beforeend');
}

const mostCommentedFilmsList = document.querySelector('.films-list--extra:last-child > .films-list__container');

for (let i = 0; i < TOP_FILM_CARD_COUNT; i++) {
  render(mostCommentedFilmsList, createFilmCardTemplate(), 'beforeend');
}

render(siteFooterStatsElement, createFooterStatsTemplate(), 'beforeend');
