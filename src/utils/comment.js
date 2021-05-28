import { nanoid } from 'nanoid';
import dayjs from 'dayjs';

export const addNewComment = (commentData) => {
  const comment = {
    id: nanoid(),
    author: 'Me',
    comment: commentData.get('comment'),
    date: dayjs(),
    emotion: commentData.get('comment-emoji'),
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
