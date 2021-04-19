import { createMovieMock } from './mock/movie.js';
import { createUserRankTemplate } from './view/user-rank.js';
import { createFooterStatsTemplate } from './view/footer-stats.js';
import { createFilterTemplate } from './view/filter-list.js';
import { createSortTemplate } from './view/sort.js';
import { createMoviesTemplate } from './view/movies.js';
import { createMovieCardTemplate } from './view/movie-card.js';
import { createShowMoreButtonTemplate } from './view/show-more-button.js';
import { createFilter } from './mock/filter.js';
import { createPopupTemplate } from './view/popup.js';
import { getRandomInteger } from './utils/common.js';

const MOVIES_COUNT = 20;
const MOVIES_COUNT_PER_STEP = 5;
const TOP_MOVIES_COUNT = 2;
const siteBodyElement = document.querySelector('body');
const siteMainElement = siteBodyElement.querySelector('.main');
const siteHeaderElement = siteBodyElement.querySelector('.header');
const siteFooterStatsElement = siteBodyElement.querySelector('.footer__statistics');

const movies = new Array(MOVIES_COUNT).fill().map((arr, i) => createMovieMock(i));
const filters = createFilter(movies);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const renderMoviesCard = () => {
  for (let i = 0; i < Math.min(movies.length, MOVIES_COUNT_PER_STEP); i++) {
    render(allMoviesList, createMovieCardTemplate(movies[i]), 'beforeend');
  }
};

const renderTopMoviesCard = () => {
  for (let i = 0; i < TOP_MOVIES_COUNT; i++) {
    render(topRatedFilmsList, createMovieCardTemplate(movies[i]), 'beforeend');
  }
};

const renderMostCommentedMoviesCard = () => {
  for (let i = 0; i < TOP_MOVIES_COUNT; i++) {
    render(mostCommentedFilmsList, createMovieCardTemplate(movies[i]), 'beforeend');
  }
};

render(siteHeaderElement, createUserRankTemplate(), 'beforeend');
render(siteMainElement, createFilterTemplate(filters), 'beforeend');
render(siteMainElement, createSortTemplate(), 'beforeend');
render(siteMainElement, createMoviesTemplate(), 'beforeend');

const films = siteMainElement.querySelector('.films');
const allMoviesList = films.querySelector('.films-list__container');
const topRatedFilmsList = films.querySelector('.films-list--extra > .films-list__container');
const mostCommentedFilmsList = films.querySelector('.films-list--extra:last-child > .films-list__container');
const filmsListElement = films.querySelector('.films-list');

if (movies.length > MOVIES_COUNT_PER_STEP) {
  let renderedTaskCount = MOVIES_COUNT_PER_STEP;
  render(filmsListElement, createShowMoreButtonTemplate(), 'beforeend');
  const showMoreButton = filmsListElement.querySelector('.films-list__show-more');

  const showMoreHandler = (evt) => {
    evt.preventDefault();

    movies
      .slice(renderedTaskCount, renderedTaskCount + MOVIES_COUNT_PER_STEP)
      .forEach((movie) => render(allMoviesList, createMovieCardTemplate(movie), 'beforeend'));

    renderedTaskCount += MOVIES_COUNT_PER_STEP;

    if (renderedTaskCount >= movies.length) {
      showMoreButton.remove();
    }
  };

  showMoreButton.addEventListener('click', showMoreHandler);
}

renderMoviesCard();
renderTopMoviesCard();
renderMostCommentedMoviesCard();
render(siteBodyElement, createPopupTemplate(movies[getRandomInteger(1, MOVIES_COUNT - 1)]), 'beforeend');
render(siteFooterStatsElement, createFooterStatsTemplate(movies.length), 'beforeend');
