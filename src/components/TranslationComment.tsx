import React from 'react';
import { formatDate } from '../utils/dateUtils';

interface Comment {
  text: string;
  timestamp: number;
}

interface TranslationCommentProps {
  comment: string | Comment;
  timestamp?: number;
}

const TranslationComment: React.FC<TranslationCommentProps> = ({ comment, timestamp }) => {
  // Handle both string comments and comment objects
  const commentText = typeof comment === 'string' ? comment : comment.text;
  const commentTimestamp = typeof comment === 'string' ? timestamp : comment.timestamp;

  return (
    <div className="mt-2 bg-gray-50 p-2 rounded text-sm">
      <p className="text-gray-600">{commentText}</p>
      {commentTimestamp && (
        <p className="text-gray-400 text-xs mt-1">
          {formatDate(commentTimestamp)}
        </p>
      )}
    </div>
  );
};

export default TranslationComment;