import SmartView from './smart.js';

import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { StatsFilter } from '../const.js';
import { makeItemsUniq, getCountMoviesByGenre, getDuration, getMinDatePeriod, isDateAfter } from '../utils/stats.js';
import { getUserRank } from '../utils/user-rank.js';

const BAR_HEIGHT = 50;

const createGenresData = (movies, period) => {
  const movieGenres = [];
  const minDatePeriod = getMinDatePeriod(period);

  if (minDatePeriod) {
    movies = movies.filter((movie) => isDateAfter(minDatePeriod, movie.userDetails.watchingDate));
  }

  movies.forEach((movie) => {
    movie.movieInfo.genre.forEach((genre) => movieGenres.push(genre));
  });

  const uniqGenres = makeItemsUniq(movieGenres);
  const movieByGenreCounts = uniqGenres.map((genre) => getCountMoviesByGenre(movies, genre));

  uniqGenres.sort((a, b) => {
    return movieByGenreCounts[uniqGenres.indexOf(b)] - movieByGenreCounts[uniqGenres.indexOf(a)];
  });

  movieByGenreCounts.sort((a, b) => {
    return b - a;
  });

  return {
    uniqGenres,
    movieByGenreCounts,
    filteredMovies: movies,
  };
};

const renderChart = (statisticCtx, data) => {
  const { movies, period } = data;
  const genresData = createGenresData(movies, period);

  statisticCtx.height = BAR_HEIGHT * genresData.uniqGenres.length;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: genresData.uniqGenres,
      datasets: [{
        data: genresData.movieByGenreCounts,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
        barThickness: 24,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createStatsTemplate = (data) => {
  const { movies, period } = data;
  const genresData = createGenresData(movies, period);
  const totalDuration = genresData.filteredMovies.reduce((accumulator, movie) => {
    return accumulator + (movie.movieInfo.duration);
  }, 0);
  const topGenre = genresData.uniqGenres[genresData.movieByGenreCounts.indexOf(Math.max(...genresData.movieByGenreCounts))];

  return `<section class="statistic visually-hidden">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${getUserRank(movies)}</span>
    </p>
    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time"
      value="${StatsFilter.ALL_TIME}" ${period === StatsFilter.ALL_TIME ? 'checked' : ''}>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today"
      value="${StatsFilter.TODAY}" ${period === StatsFilter.TODAY ? 'checked' : ''}>
      <label for="statistic-today" class="statistic__filters-label">Today</label>
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week"
      value="${StatsFilter.WEEK}" ${period === StatsFilter.WEEK ? 'checked' : ''}>
      <label for="statistic-week" class="statistic__filters-label">Week</label>
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month"
      value="${StatsFilter.MONTH}" ${period === StatsFilter.MONTH ? 'checked' : ''}>
      <label for="statistic-month" class="statistic__filters-label">Month</label>
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year"
      value="${StatsFilter.YEAR}" ${period === StatsFilter.YEAR ? 'checked' : ''}>
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>
    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${genresData.filteredMovies.length} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">
          <span class="statistic__item-description">${getDuration(totalDuration)}</span>
        </p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre ? topGenre : ''}</p>
      </li>
    </ul>
    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>
  </section>`;
};

export default class Stats extends SmartView {
  constructor(movies) {
    super();

    this._data = {
      movies,
      period: StatsFilter.ALL_TIME,
    };

    this._handleFiltersChange = this._handleFiltersChange.bind(this);
  }

  getTemplate() {
    return createStatsTemplate(this._data);
  }

  restoreHandlers() {
    this.setFiltersChangeHandler(this._callback.filtersChange);
  }

  setChart() {
    renderChart(this.getElement().querySelector('.statistic__chart'), this._data);
  }

  _handleFiltersChange(evt) {
    evt.preventDefault();
    this._callback.filtersChange(evt.target.value);
  }

  setFiltersChangeHandler(callback) {
    this._callback.filtersChange = callback;
    this.getElement()
      .querySelector('.statistic__filters')
      .addEventListener('change', this._handleFiltersChange);
  }
}
