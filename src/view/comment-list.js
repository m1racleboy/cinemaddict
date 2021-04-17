import dayjs from 'dayjs';

export const createCommentTemplate = (comments) => {
  return Object.values(comments).map(({ author, comment, date, emotion }) => `
    <li class='film-details__comment'>
      <span class='film-details__comment-emoji'>
        <img src='./images/emoji/${emotion}.png' width='55' height='55' alt='emoji-${emotion}'>
      </span>
      <div>
        <p class='film-details__comment-text'>${comment}</p>
        <p class='film-details__comment-info'>
          <span class='film-details__comment-author'>${author}</span>
          <span class='film-details__comment-day'>${dayjs(date).format('DD MM YY')}</span>
          <button class='film-details__comment-delete'>Delete</button>
        </p>
      </div>
    </li>
  `).join('');
};
