import { nanoid } from 'nanoid';
import dayjs from 'dayjs';

export const addNewComment = () => {
  const comment = {
    id: nanoid(),
    author: 'Me',
    comment: '',
    date: dayjs(),
    emotion: null,
  };

  return comment;
};
