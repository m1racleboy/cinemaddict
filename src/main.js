import { renderMovie } from './mock/movie.js';
import { createUserRankTemplate } from './view/user-rank.js';
import { createFooterStatsTemplate } from './view/footer-stats.js';
import { createMainNavigationTemplate } from './view/main-navigation.js';
import { createSortTemplate } from './view/sort.js';
import { createMoviesTemplate } from './view/movies.js';
import { createMovieCardTemplate } from './view/movie-card.js';
import { createShowMoreButtonTemplate } from './view/show-more-button.js';
import { generateFilter } from './mock/filter.js';
import { createPopupTemplate } from './view/popup.js';
import { getRandomInteger } from './utils/common.js';

const MOVIES_COUNT = 20;
const MOVIES_COUNT_PER_STEP = 5;
const TOP_MOVIES_COUNT = 2;
const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterStatsElement = document.querySelector('.footer__statistics');

const movies = new Array(MOVIES_COUNT).fill().map((arr, i) => renderMovie(i));
const filters = generateFilter(movies);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const renderMoviesCard = () => {
  for (let i = 0; i < Math.min(movies.length, MOVIES_COUNT_PER_STEP); i++) {
    render(allMoviesList, createMovieCardTemplate(movies[i]), 'beforeend');
  }
};

const renderTopMoviesCard = () => {
  movies.sort((a, b) => {
    if (a.movie_info.rating < b.movie_info.rating) {
      return 1;
    }
    if (a.movie_info.rating > b.movie_info.rating) {
      return -1;
    }
    return 0;
  });

  for (let i = 0; i < TOP_MOVIES_COUNT; i++) {
    render(topRatedFilmsList, createMovieCardTemplate(movies[i]), 'beforeend');
  }
};

const renderMostCommentedMoviesCard = () => {
  movies.sort((a, b) => {
    if (a.comments.length < b.comments.length) {
      return 1;
    }
    if (a.comments.length > b.comments.length) {
      return -1;
    }
    return 0;
  });

  for (let i = 0; i < TOP_MOVIES_COUNT; i++) {
    render(mostCommentedFilmsList, createMovieCardTemplate(movies[i]), 'beforeend');
  }
};

render(siteHeaderElement, createUserRankTemplate(), 'beforeend');
render(siteMainElement, createMainNavigationTemplate(filters), 'beforeend');
render(siteMainElement, createSortTemplate(), 'beforeend');
render(siteMainElement, createMoviesTemplate(), 'beforeend');

const films = document.querySelector('.films');
const allMoviesList = films.querySelector('.films-list__container');

renderMoviesCard();

const topRatedFilmsList = films.querySelector('.films-list--extra > .films-list__container');

renderTopMoviesCard();

const mostCommentedFilmsList = films.querySelector('.films-list--extra:last-child > .films-list__container');

renderMostCommentedMoviesCard();

const filmsListElement = films.querySelector('.films-list');

if (movies.length > MOVIES_COUNT_PER_STEP) {
  let renderedTaskCount = MOVIES_COUNT_PER_STEP;
  render(filmsListElement, createShowMoreButtonTemplate(), 'beforeend');

  const showMoreButton = filmsListElement.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    movies
      .slice(renderedTaskCount, renderedTaskCount + MOVIES_COUNT_PER_STEP)
      .forEach((movie) => render(allMoviesList, createMovieCardTemplate(movie), 'beforeend'));

    renderedTaskCount += MOVIES_COUNT_PER_STEP;

    if (renderedTaskCount >= movies.length) {
      showMoreButton.remove();
    }
  });
}
render(allMoviesList, createPopupTemplate(movies[getRandomInteger(1, MOVIES_COUNT - 1)]), 'beforeend');
render(siteFooterStatsElement, createFooterStatsTemplate(movies.length), 'beforeend');
