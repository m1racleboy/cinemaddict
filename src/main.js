import MenuView from './view/menu.js';
import StatsView from './view/stats.js';
import FooterStatsView from './view/footer-stats.js';

import { createMovieMock } from './mock/movie.js';
import { getComment } from './mock/comment.js';
import { render, RenderPosition } from './utils/render.js';

import FilterPresenter from './presenter/filter.js';
import BoardPresenter from './presenter/board.js';

import FilterModel from './model/filter.js';
import CommentModel from './model/comment.js';
import MovieModel from './model/movie.js';


const MOVIES_COUNT = 30;
const COMMENTS_COUNT = 7;

export const siteBodyElement = document.querySelector('body');
const siteMainElement = siteBodyElement.querySelector('.main');
const siteHeaderElement = siteBodyElement.querySelector('.header');
const siteFooterStatsElement = siteBodyElement.querySelector('.footer__statistics');

const movies = new Array(MOVIES_COUNT).fill().map(() => createMovieMock());
const comments = new Array(COMMENTS_COUNT).fill().map((value, index) => getComment(index));

const menuComponent = new MenuView();
const statsComponent = new StatsView(movies.filter((movie) => movie.userDetails.isHistory));

const movieModel = new MovieModel();
const commentModel = new CommentModel();
const filterModel = new FilterModel();

const handleStatsClick = () => {
  statsComponent.setChart();
  statsComponent.show();
  boardPresenter.hide();
  filterPresenter.removeActiveClass();
};

movieModel.setMovies(movies);
commentModel.setComments(comments);

render(siteMainElement, menuComponent, RenderPosition.AFTERBEGIN);
menuComponent.setStatsClickHandler(handleStatsClick);

const boardPresenter = new BoardPresenter(siteMainElement, movieModel, filterModel, statsComponent, siteHeaderElement, commentModel);
const filterPresenter = new FilterPresenter(menuComponent.getElement(), filterModel, movieModel, boardPresenter, statsComponent, menuComponent);

filterPresenter.init();
boardPresenter.init();

statsComponent.setFiltersChangeHandler((period) => {
  statsComponent.updateData({ period });
  statsComponent.setChart();
  statsComponent.show();
});

render(siteMainElement, statsComponent, RenderPosition.BEFOREEND);
render(siteFooterStatsElement, new FooterStatsView(movies.length), RenderPosition.BEFOREEND);
