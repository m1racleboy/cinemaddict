import dayjs from 'dayjs';
import { createCommentTemplate } from './comment-list.js';
import { EMOJIS } from '../const.js';
const createEmojiTemplate = (emoji) => {
  return `
    <input class='film-details__emoji-item visually-hidden' name='comment-emoji' type='radio' id='emoji-${emoji}' value='${emoji}'>
    <label class='film-details__emoji-label' for='emoji-${emoji}'>
      <img src='./images/emoji/${emoji}.png' width='30' height='30' alt='emoji'>
    </label>
  `;
};

export const createPopupTemplate = (movie) => {
  const {
    movie_info: {
      title, alternative_title, poster, age_rating, rating, director, writers, actors, genre, description, duration,
    },
    release: {
      date, release_country,
    },
    user_details: {
      isWatchList, isHistory, isFavorite,
    },
    comments,
  } = movie;

  const getChecked = (check) => check ? 'checked' : '';

  const commentsCount = comments.length;
  const commentsTemplate = createCommentTemplate(comments);

  const emojiItemsTemplate = EMOJIS
    .map((emoji) => createEmojiTemplate(emoji))
    .join('');

  return `
    <section class='film-details visually-hidden'>
      <form class='film-details__inner' action='' method='get'>
        <div class='film-details__top-container'>
          <div class='film-details__close'>
            <button class='film-details__close-btn' type='button'>close</button>
          </div>
          <div class='film-details__info-wrap'>
            <div class='film-details__poster'>
              <img class='film-details__poster-img' src=${poster} alt=''>
              <p class='film-details__age'>${age_rating}+</p>
            </div>
            <div class='film-details__info'>
              <div class='film-details__info-head'>
                <div class='film-details__title-wrap'>
                  <h3 class='film-details__title'>${title}</h3>
                  <p class='film-details__title-original'>Original: ${alternative_title}</p>
                </div>
                <div class='film-details__rating'>
                  <p class='film-details__total-rating'>${rating}</p>
                </div>
              </div>
              <table class='film-details__table'>
                <tr class='film-details__row'>
                  <td class='film-details__term'>Director</td>
                  <td class='film-details__cell'>${director}</td>
                </tr>
                <tr class='film-details__row'>
                  <td class='film-details__term'>Writers</td>
                  <td class='film-details__cell'>${writers}</td>
                </tr>
                <tr class='film-details__row'>
                  <td class='film-details__term'>Actors</td>
                  <td class='film-details__cell'>${actors}</td>
                </tr>
                <tr class='film-details__row'>
                  <td class='film-details__term'>Release Date</td>
                  <td class='film-details__cell'>${dayjs(date).format('DD MMMM YYYY')}</td>
                </tr>
                <tr class='film-details__row'>
                  <td class='film-details__term'>Runtime</td>
                  <td class='film-details__cell'>${duration}</td>
                </tr>
                <tr class='film-details__row'>
                  <td class='film-details__term'>Country</td>
                  <td class='film-details__cell'>${release_country}</td>
                </tr>
                <tr class='film-details__row'>
                  <td class='film-details__term'>Genre${genre.length > 1 ? 's' : ''}</td>
                  <td class='film-details__cell'>
                    <span class='film-details__genre'>${genre}</span>
                </tr>
              </table>
              <p class='film-details__film-description'>${description}</p>
            </div>
          </div>
          <section class='film-details__controls'>
            <input type='checkbox' class='film-details__control-input visually-hidden' id='watchlist' name='watchlist' ${getChecked(isWatchList)}>
            <label for='watchlist' class='film-details__control-label film-details__control-label--watchlist'>Add to watchlist</label>
            <input type='checkbox' class='film-details__control-input visually-hidden' id='watched' name='watched ${getChecked(isHistory)}'>
            <label for='watched' class='film-details__control-label film-details__control-label--watched'>Already watched</label>
            <input type='checkbox' class='film-details__control-input visually-hidden' id='favorite' name='favorite' ${getChecked(isFavorite)}>
            <label for='favorite' class='film-details__control-label film-details__control-label--favorite'>Add to favorites</label>
          </section>
        </div>
        <div class='film-details__bottom-container'>
          <section class='film-details__comments-wrap'>
            <h3 class='film-details__comments-title'>Comments <span class='film-details__comments-count'>${commentsCount}</span></h3>
            <ul class='film-details__comments-list'>
              ${commentsTemplate}
            </ul>
            <div class='film-details__new-comment'>
              <div class='film-details__add-emoji-label'></div>
              <label class='film-details__comment-label'>
                <textarea class='film-details__comment-input' placeholder='Select reaction below and write comment here' name='comment'></textarea>
              </label>
              <div class='film-details__emoji-list'>
                ${emojiItemsTemplate}
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>
  `;
};
