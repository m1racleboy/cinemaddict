export const createMovieCardTemplate = (movie) => {
  const {
    title, rating, poster, description, duration, genre, isWatchList, isHistory, isFavorite, comment,
  } = movie;
  return `
  <article class="film-card">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">1929</span>
      <span class="film-card__duration">${duration}</span>
      <span class="film-card__genre">${genre}</span>
    </p>
    <img src=${poster} alt="" class="film-card__poster">
    <p class="film-card__description">${description}</p>
    <a class="film-card__comments">${comment.length} comments</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${isWatchList ? 'film-card__controls-item--active' : ''}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${isHistory ? 'film-card__controls-item--active' : ''}" type="button">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite ${isFavorite ? 'film-card__controls-item--active' : ''}" type="button">Mark as favorite</button>
    </div>
  </article>
  `;
};
