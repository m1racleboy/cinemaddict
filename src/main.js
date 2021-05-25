import UserRankView from './view/user-rank.js';
import MenuView from './view/menu.js';
import StatsView from './view/stats.js';
import FooterStatsView from './view/footer-stats.js';

import { createMovieMock } from './mock/movie.js';
import { render, RenderPosition } from './utils/render.js';
import { getUserRank } from './utils/user-rank.js';

import FilterPresenter from './presenter/filter.js';
import BoardPresenter from './presenter/board.js';

import FilterModel from './model/filter.js';
import MovieModel from './model/movie.js';


const MOVIES_COUNT = 30;

export const siteBodyElement = document.querySelector('body');
const siteMainElement = siteBodyElement.querySelector('.main');
const siteHeaderElement = siteBodyElement.querySelector('.header');
const siteFooterStatsElement = siteBodyElement.querySelector('.footer__statistics');

const movies = new Array(MOVIES_COUNT).fill().map(() => createMovieMock());
const userRank = getUserRank(movies);

const menuComponent = new MenuView();
const statsComponent = new StatsView(movies.filter((movie) => movie.user_details.isHistory));
const userRankComponent = new UserRankView(userRank);

if (movies.length) {
  render(siteHeaderElement, userRankComponent, RenderPosition.BEFOREEND);
}

const movieModel = new MovieModel();
const filterModel = new FilterModel();

const onStatsClick = () => {
  statsComponent.setChart();
  statsComponent.show();
  boardPresenter.hide();
  filterPresenter.removeActiveClass();
};

movieModel.setMovies(movies);

render(siteHeaderElement, userRankComponent, RenderPosition.BEFOREEND);
render(siteMainElement, menuComponent, RenderPosition.AFTERBEGIN);
menuComponent.setStatsClickHandler(onStatsClick);

const boardPresenter = new BoardPresenter(siteMainElement, movieModel, filterModel, statsComponent);
const filterPresenter = new FilterPresenter(
  menuComponent.getElement(),
  filterModel,
  movieModel,
  boardPresenter,
  statsComponent,
  menuComponent);

filterPresenter.init();
boardPresenter.init();

statsComponent.setFiltersChangeHandler((period) => {
  statsComponent.updateData({ period });
  statsComponent.setChart();
  statsComponent.show();
});

render(siteMainElement, statsComponent, RenderPosition.BEFOREEND);
render(siteFooterStatsElement, new FooterStatsView(movies.length), RenderPosition.BEFOREEND);
