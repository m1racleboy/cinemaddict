import AbstractView from './abstract.js';

const createMoviesBoardTemplate = () => {
  return '<section class="films"></section>';
};

export default class MoviesBoard extends AbstractView {
  getTemplate() {
    return createMoviesBoardTemplate();
  }
}
