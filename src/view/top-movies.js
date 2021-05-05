import AbstractView from './abstract.js';

const createTopMoviesTemplate = () => {
  return `<section class="films-list films-list--extra films-list--top">
            <h2 class="films-list__title">Top rated</h2>
            <div class="films-list__container films-list__container--top"></div>
          </section>`;
};

export default class TopMovies extends AbstractView {
  getTemplate() {
    return createTopMoviesTemplate();
  }
}
