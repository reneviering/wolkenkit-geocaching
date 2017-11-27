import moment from 'moment';
import React from 'react';

const CommentListItem = function ({ comment }) {
  return (
    <li className='list-group-item'>
      {comment.text}
      <span className='pull-right'>{moment(comment.timestamp).format('DD.MM.YYYY HH:mm')}</span>
    </li>
  );
};

export default CommentListItem;
