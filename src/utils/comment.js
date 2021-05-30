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
