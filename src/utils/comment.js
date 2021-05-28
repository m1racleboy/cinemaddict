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

export const getComments = (commentsId, commentsList) => {
  const comments = [];

  for (const comment of commentsList) {
    if (commentsId.some((value) => value === comment.id)) {
      comments.push(comment);
    }
  }

  return comments;
};
