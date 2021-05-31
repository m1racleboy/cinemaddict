import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';

export const addNewComment = (commentData) => {
  const comment = {
    comment: commentData.get('comment'),
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

export const humanizeCommentDate = (date) => {
  dayjs.extend(relativeTime);

  return `${dayjs(date).toNow(true)} ago`;
};
