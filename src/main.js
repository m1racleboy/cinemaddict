import MenuView from './view/menu.js';
import StatsView from './view/stats.js';
import FooterStatsView from './view/footer-stats.js';

import { UpdateType } from './const.js';
import { render, RenderPosition } from './utils/render.js';

import FilterPresenter from './presenter/filter.js';
import BoardPresenter from './presenter/board.js';

import FilterModel from './model/filter.js';
import MovieModel from './model/movie.js';

import Api from './api/api.js';
import Store from './api/store.js';
import Provider from './api/provider.js';

const AUTHORIZATION = 'Basic zxcSF-48lgnEZtpMID-v';
const END_POINT = 'https://14.ecmascript.pages.academy/cinemaddict';
const STORE_PREFIX = 'cinemaddict-localstorage';
const STORE_VER = 'v14';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const emptyApi = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const api = new Provider(emptyApi, store);

export const siteBodyElement = document.querySelector('body');
const siteMainElement = siteBodyElement.querySelector('.main');
const siteHeaderElement = siteBodyElement.querySelector('.header');
const siteFooterStatsElement = siteBodyElement.querySelector('.footer__statistics');

const menuComponent = new MenuView();
const statsComponent = new StatsView([]);

const movieModel = new MovieModel();
const filterModel = new FilterModel();

const handleStatsClick = () => {
  statsComponent.setChart();
  statsComponent.show();
  boardPresenter.hide();
  filterPresenter.removeActiveClass();
};

const boardPresenter = new BoardPresenter(siteMainElement, movieModel, filterModel, statsComponent, siteHeaderElement, api);
const filterPresenter = new FilterPresenter(menuComponent.getElement(), filterModel, movieModel, boardPresenter, statsComponent, menuComponent);

filterPresenter.init();
boardPresenter.init();

statsComponent.setFiltersChangeHandler((period) => {
  statsComponent.updateData({ period });
  statsComponent.setChart();
  statsComponent.show();
});

api.getMovies()
  .then((movies) => {
    movieModel.setMovies(UpdateType.INIT, movies);

    render(siteMainElement, menuComponent, RenderPosition.AFTERBEGIN);
    menuComponent.setStatsClickHandler(handleStatsClick);

    render(siteMainElement, statsComponent, RenderPosition.BEFOREEND);
    render(siteFooterStatsElement, new FooterStatsView(movies.length), RenderPosition.BEFOREEND);
  })
  .catch(() => {
    movieModel.setMovies(UpdateType.INIT, []);

    render(siteMainElement, menuComponent, RenderPosition.AFTERBEGIN);
    menuComponent.setStatsClickHandler(handleStatsClick);

    render(siteMainElement, statsComponent, RenderPosition.BEFOREEND);
    render(siteFooterStatsElement, new FooterStatsView(0), RenderPosition.BEFOREEND);
  });

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  api.sync();
});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
});
