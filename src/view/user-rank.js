import { createElement } from '../utils/common.js';

const createUserRankTemplate = (movies) => {
  let count = 0;

  movies.forEach(movie => {
    if (movie.user_details.isWatchList) {
      count++;
    }
  });

  const rank = {
    novice: {
      name: 'novice'
    },
    fan: {
      name: 'fan'
    },
    movieBuff: {
      name: 'movie buff'
    },
  };

  let userRank;

  if (count === 0) {
    return '<section class="header__profile profile"></section>';
  }
  else if (count > 0 && count < 11) {
    userRank = rank.novice;
  }
  else if (count > 10 && count < 21) {
    userRank = rank.fan;
  }
  else {
    userRank = rank.movieBuff;
  }
  return `<section class="header__profile profile">
            <p class="profile__rating">${userRank.name}</p>
            <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
          </section>`;
};

export default class UserRank {
  constructor(movies) {
    this._movies = movies;
    this._element = null;
  }

  getTemplate() {
    return createUserRankTemplate(this._movies);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
