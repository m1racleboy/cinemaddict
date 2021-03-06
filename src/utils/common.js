export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomArrayElement = (elements) => {
  return elements[getRandomInteger(0, elements.length - 1)];
};

export const getRandomArray = (array, length) => {
  const arrayCopy = [...array];
  for (let i = 0; i < (array.length - length); i++) {
    arrayCopy.splice(~~getRandomInteger(0, arrayCopy.length), 1);
  }
  return arrayCopy;
};

export const isOnline = () => {
  return window.navigator.onLine;
};
