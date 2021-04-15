import { getRandomArray, getRandomArrayElement, getRandomInteger } from '../utils/common.js';
import dayjs from 'dayjs';
import { getComment } from './comment.js';
const HIGH_RATING = 10;
const COMMENT_COUNT = 5;
const MAX_HOURS = 6;
const MAX_MINUTES = 59;
const DESCRIPTIONS = [
  'Похождения Шерлока Холмса и его друга Джона.',
  'Школьнику на лицо упала тетрадь и он начал убивать людей, так он думал, но он находился в шизофренической лечебнице.',
  'Брат с сестрой прошли все игры на свете и словили шизу, оказавшись в другом мире, разваливая няшных кошкодевочек и эльфиек.',
  'Сухой закон, Япония, у паренька убили всю семью, он случайно выжил и ему пришло письмо, после этого он решил убить всех.',
  'Паренёк ростом 1.64 прыгает выше двухметровых дядей, хочет стать крутым волейболистом',
  'У школьника умер дед, после этого он увидел как злой дух хочет убить школьницу, он съел какой-то странный палец и стал крутым перцем, а еще у него учитель величайший маг своего времени',
  'Челик вычитает из 1000 7 на протяжении 4-х сезонов и перекрашивает волосы пока жмет zxc на финде',
];

const TITLES = [
  '91 days',
  'death note',
  'haikyuu',
  'no game no life',
  'tower of god',
  'Jujutsu Kaisen',
  'Tokyo ghoul',
];

const GENRES = [
  'Сёнен',
  'Детектив',
  'Спорт',
  'Гаремник',
  'Сын драгонбола',
  'Ньюскул сёнен',
];

const POSTERS = [
  'images/posters/made-for-each-other.png',
  'images/posters/popeye-meets-sinbad.png',
  'images/posters/sagebrush-trail.jpg',
  'images/posters/santa-claus-conquers-the-martians.jpg',
  'images/posters/the-dance-of-life.jpg',
];

const AGE_RATINGS = [
  0,
  6,
  12,
  16,
  18,
  21,
];

const DIRECTORS = [
  'Кишимото',
  'Эйчиро Ода',
  'Кристофер Нолан',
  'Квентин Торантино',
  'Хаяо Миядзаки',
];

const WRITERS = [
  'Крутой писатель первый',
  'Павел Воля',
  'Кто-то кого я не придумал',
  'Пусть еще кто-нибудь будет типа писателя черепашек нинзя',
];

const ACTORS = [
  'Анджелина Джоли',
  'Наруто Узумаки',
  'Саске Учиха',
  'Шоё Хината',
  'Канеки Кен (Калека)',
  'На что я трачу свою жизнь, печатая это :(',
];

const COUNTIES = [
  'Japan',
  'Russia',
  'USA',
  'Finland',
  'Korea',
  'Germany',
];


export const renderMovie = (id) => {
  const title = getRandomArrayElement(TITLES);
  const ratingA = getRandomInteger(0, HIGH_RATING);
  const ratingB = +`${ratingA === 10 ? ratingA : ratingA + `.${getRandomInteger(0, 9)}`}`;
  const comments = [];

  for (let i = 0; i < COMMENT_COUNT; i++) {
    comments[i] = getComment(i);
  }

  return {
    id: id,
    title: title,
    alternative_title: `re: ${title}`,
    rating: ratingB,
    poster: getRandomArrayElement(POSTERS),
    age_rating: getRandomArrayElement(AGE_RATINGS),
    director: getRandomArrayElement(DIRECTORS),
    writers: getRandomArray(WRITERS),
    actors: getRandomArray(ACTORS),
    date: dayjs().toDate(),
    release_country: getRandomArrayElement(COUNTIES),
    duration: `${getRandomInteger(0, MAX_HOURS)}h ${getRandomInteger(0, MAX_MINUTES)}m`,
    genre: getRandomArray(GENRES),
    description: getRandomArrayElement(DESCRIPTIONS),
    comment: comments,
    isWatchList: Boolean(getRandomInteger(0, 1)),
    isHistory: Boolean(getRandomInteger(0, 1)),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    watching_date: dayjs().toDate(),
  };
};
