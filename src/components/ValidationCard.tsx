import React, { useState, useRef, useEffect } from 'react';
import { Check, X, MessageSquare } from 'lucide-react';
import { getLanguageFlag } from '../utils/languageUtils';
import { formatDate } from '../utils/dateUtils';

interface Comment {
  text: string;
  timestamp: string;
}

interface ValidationCardProps {
  id: string;
  originalText: string;
  translatedText: string;
  languageCode: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
  comments: Comment[];
  onStatusChange: (id: string, status: 'approved' | 'rejected') => void;
  onTranslationEdit: (id: string, newText: string) => void;
  onCommentAdd: (id: string, comment: string) => void;
  onDelete: (id: string) => void;
}

const ValidationCard: React.FC<ValidationCardProps> = ({
  id,
  originalText,
  translatedText,
  languageCode,
  status,
  timestamp,
  comments,
  onStatusChange,
  onTranslationEdit,
  onCommentAdd,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(translatedText);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [newComment, setNewComment] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [isEditing]);

  const handleClickOutside = () => {
    if (isEditing) {
      setIsEditing(false);
      if (editedText !== translatedText) {
        onTranslationEdit(id, editedText);
      }
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onCommentAdd(id, newComment.trim());
      setNewComment('');
      setShowCommentInput(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{getLanguageFlag(languageCode)}</span>
            <span className="text-sm font-medium text-gray-600">{formatDate(timestamp)}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onStatusChange(id, 'approved')}
              className={`p-1.5 rounded-full transition-colors duration-200 ${
                status === 'approved'
                  ? 'bg-green-100 text-green-600'
                  : 'hover:bg-gray-100 text-gray-400'
              }`}
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={() => onStatusChange(id, 'rejected')}
              className={`p-1.5 rounded-full transition-colors duration-200 ${
                status === 'rejected'
                  ? 'bg-red-100 text-red-600'
                  : 'hover:bg-gray-100 text-gray-400'
              }`}
            >
              <X className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(id)}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 transition-colors duration-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Original Text</label>
            <p className="text-sm text-gray-800">{originalText}</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Translation</label>
            {isEditing ? (
              <textarea
                ref={textareaRef}
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                onBlur={handleClickOutside}
                className="w-full text-sm text-gray-800 border-0 focus:ring-0 p-0 resize-none"
                rows={1}
              />
            ) : (
              <p
                onClick={() => setIsEditing(true)}
                className="text-sm text-gray-800 cursor-text"
              >
                {translatedText}
              </p>
            )}
          </div>

          {comments.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-500">Comments</label>
              {comments.map((comment, index) => (
                <div key={index} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  <p>{comment.text}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(comment.timestamp)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-100">
        {showCommentInput ? (
          <form onSubmit={handleCommentSubmit} className="p-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full text-sm border-gray-200 rounded-md focus:ring-black focus:border-black"
              rows={2}
            />
            <div className="mt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCommentInput(false)}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="px-3 py-1.5 text-sm bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Comment
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowCommentInput(true)}
            className="w-full p-3 text-sm text-gray-600 hover:text-gray-800 flex items-center justify-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            Add Comment
          </button>
        )}
      </div>
    </div>
  );
};

export default ValidationCard;