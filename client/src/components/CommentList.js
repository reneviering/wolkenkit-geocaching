import CommentListItem from './CommentListItem';
import React from 'react';

const CommentList = function ({ comments }) {
  return (
    <ul className='list-group'>
      { comments
        .sort((left, right) => right.timestamp - left.timestamp)
        .map((comment, index) => <CommentListItem key={ index } comment={ comment } />) }
    </ul>
  );
};

export default CommentList;
