import UserRankView from './view/user-rank.js';
import FooterStatsView from './view/footer-stats.js';
import FilterListView from './view/filter-list.js';
import { createMovieMock } from './mock/movie.js';
import { createFilter } from './mock/filter.js';
import { render, RenderPosition } from './utils/render.js';
import BoardPresenter from './presenter/board.js';

const MOVIES_COUNT = 20;
export const siteBodyElement = document.querySelector('body');
const siteMainElement = siteBodyElement.querySelector('.main');
const siteHeaderElement = siteBodyElement.querySelector('.header');
const siteFooterStatsElement = siteBodyElement.querySelector('.footer__statistics');

const movies = new Array(MOVIES_COUNT).fill().map((arr, i) => createMovieMock(i));
const filters = createFilter(movies);

render(siteHeaderElement, new UserRankView(movies), RenderPosition.BEFOREEND);
render(siteMainElement, new FilterListView(filters), RenderPosition.BEFOREEND);
const boardPresenter = new BoardPresenter(siteMainElement);
boardPresenter.init(movies);
render(siteFooterStatsElement, new FooterStatsView(movies.length), RenderPosition.BEFOREEND);
