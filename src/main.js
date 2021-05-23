import UserRankView from './view/user-rank.js';
import FooterStatsView from './view/footer-stats.js';

import { createMovieMock } from './mock/movie.js';
import { render, RenderPosition } from './utils/render.js';

import FilterPresenter from './presenter/filter.js';
import BoardPresenter from './presenter/board.js';

import FilterModel from './model/filter.js';
import MovieModel from './model/movie.js';


const MOVIES_COUNT = 20;

export const siteBodyElement = document.querySelector('body');
const siteMainElement = siteBodyElement.querySelector('.main');
const siteHeaderElement = siteBodyElement.querySelector('.header');
const siteFooterStatsElement = siteBodyElement.querySelector('.footer__statistics');

const movies = new Array(MOVIES_COUNT).fill().map(() => createMovieMock());

const movieModel = new MovieModel();
const filterModel = new FilterModel();
movieModel.setMovies(movies);

render(siteHeaderElement, new UserRankView(movies), RenderPosition.BEFOREEND);

const boardPresenter = new BoardPresenter(siteMainElement, movieModel, filterModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, movieModel);

filterPresenter.init();
boardPresenter.init();

render(siteFooterStatsElement, new FooterStatsView(movies.length), RenderPosition.BEFOREEND);
