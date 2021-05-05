import AbstractView from './abstract.js';

const createMostCommentedMoviesTemplate = () => {
  return `<section class="films-list films-list--extra films-list--most-commented">
            <h2 class="films-list__title">Most commented</h2>
            <div class="films-list__container films-list__container--most-commented"></div>
          </section>`;
};

export default class MostCommentedMovies extends AbstractView {
  getTemplate() {
    return createMostCommentedMoviesTemplate();
  }
}
