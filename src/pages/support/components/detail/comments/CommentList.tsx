import React from 'react';
import { TicketComment } from '../../../../../types/ticket';
import CommentItem from './CommentItem';

interface CommentListProps {
  comments: TicketComment[];
  isAdmin: boolean;
}

const CommentList: React.FC<CommentListProps> = ({ comments, isAdmin }) => {
  // Filter internal comments for non-admin users
  const visibleComments = isAdmin 
    ? comments 
    : comments.filter(comment => !comment.isInternal);

  if (visibleComments.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        Noch keine Kommentare vorhanden.
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {visibleComments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default CommentList;