import { EMOJIS } from '../const.js';
import { getRandomArrayElement, getRandomInteger } from '../utils/common.js';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';

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

export const getComment = () => {
  const date = dayjs().add(getRandomInteger(0, -200), 'year')
    .add(getRandomInteger(1, 12), 'month')
    .add(getRandomInteger(1, 31), 'day')
    .toDate();

  return {
    id: nanoid(),
    author: getRandomArrayElement(AUTHORS),
    comment: getRandomArrayElement(COMMENTS),
    date: date,
    emotion: getRandomArrayElement(EMOJIS),
  };
};
