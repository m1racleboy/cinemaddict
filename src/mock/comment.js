import { EMOJIS } from '../const.js';
import { getRandomArrayElement } from '../utils/common.js';
import dayjs from 'dayjs';
const AUTHORS = [
  'Никита',
  'Тёмыч',
  'Тимлид',
  'Дашенька',
  'Кирич',
  'Альбина aka наставница',
];

const COMMENTS = [
  'Аниме(фильм) параша',
  'Продолжение ты здесь? Ты не здесь',
  'Лучшее, что я видел(а?) в этом тысячелетии',
  'В конце гг умрет ахахха',
  '1000-7',
];

export const getComment = (id) => {
  return {
    id: id,
    author: getRandomArrayElement(AUTHORS),
    comment: getRandomArrayElement(COMMENTS),
    date: dayjs().toDate(),
    emotion: getRandomArrayElement(EMOJIS),
  };
};
