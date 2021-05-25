import FilterView from '../view/filter-list.js';
import { render, replace, RenderPosition } from '../utils/render.js';
import { UpdateType, FilterType } from '../const.js';
import { filter } from '../utils/filter.js';

export default class Filter {
  constructor(filterContainer, filterModel, moviesModel, boardPresenter, statsComponent, menuComponent) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._moviesModel = moviesModel;

    this._filterComponent = null;
    this._statsComponent = statsComponent;
    this._menuComponent = menuComponent;

    this._boardPresenter = boardPresenter;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(filters, this._filterModel.getFilter());
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    prevFilterComponent.getElement().remove();
    prevFilterComponent.removeElement();
  }

  removeActiveClass() {
    this._filterComponent.removeActiveClass();
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._filterModel.getFilter() !== filterType || !this._boardPresenter.isShown) {
      this._filterModel.setFilter(UpdateType.MAJOR, filterType);
    }

    this._boardPresenter.show();
    this._statsComponent.hide();
    this._menuComponent.removeActiveClass();
  }

  _getFilters() {
    const movies = this._moviesModel.getMovies();

    return [
      {
        type: FilterType.ALL,
        name: 'All movies',
        count: filter[FilterType.ALL](movies).length,
      },
      {
        type: FilterType.WATCH_LIST,
        name: 'Watchlist',
        count: filter[FilterType.WATCH_LIST](movies).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'History',
        count: filter[FilterType.HISTORY](movies).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: filter[FilterType.FAVORITES](movies).length,
      },
    ];
  }
}
