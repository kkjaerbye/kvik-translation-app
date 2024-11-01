import React, { useState, useRef, useEffect } from 'react';
import { Check, X, Trash2, MessageSquare, Copy, CheckCircle2, Share2 } from 'lucide-react';
import { Translation } from '../types/translation';
import { languages } from '../constants/languages';
import { formatDate } from '../utils/dateUtils';
import { languageEmojis } from '../constants/languageEmojis';
import TranslationComment from './TranslationComment';

interface TranslationItemProps {
  translation: Translation;
  onStatusChange: (timestamp: number, language: string, status: 'approved' | 'rejected') => void;
  onDelete: (timestamp: number) => void;
  onEdit: (timestamp: number, language: string, text: string) => void;
  onAddComment: (timestamp: number, language: string, comment: string) => void;
  editingTranslation: { timestamp: number; language: string; text: string; } | null;
  onSaveEdit: () => void;
  isHighlighted?: boolean;
}

const TranslationItem: React.FC<TranslationItemProps> = ({
  translation,
  onStatusChange,
  onDelete,
  onEdit,
  onAddComment,
  editingTranslation,
  onSaveEdit,
  isHighlighted
}) => {
  const [showCommentInput, setShowCommentInput] = useState<{
    timestamp: number;
    language: string;
  } | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});
  const [copiedShareLink, setCopiedShareLink] = useState(false);
  const itemRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (isHighlighted && itemRef.current) {
      itemRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isHighlighted]);

  const handleAddComment = (timestamp: number, language: string) => {
    if (!commentInput.trim()) return;
    onAddComment(timestamp, language, commentInput);
    setCommentInput('');
    setShowCommentInput(null);
  };

  const handleCopy = async (text: string, language: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates({ ...copiedStates, [language]: true });
      setTimeout(() => {
        setCopiedStates({ ...copiedStates, [language]: false });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleShareLink = async () => {
    const shareUrl = `${window.location.origin}/validations?id=${translation.timestamp}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedShareLink(true);
      setTimeout(() => {
        setCopiedShareLink(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy share link:', err);
    }
  };

  return (
    <li 
      ref={itemRef}
      className={`bg-gray-50 rounded-lg p-6 transition-all duration-300 ${
        isHighlighted ? 'ring-2 ring-black ring-offset-2' : ''
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-2">
            {formatDate(translation.timestamp)}
          </p>
          <p className="text-gray-900 font-medium">{translation.originalText}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleShareLink}
            className={`p-1.5 rounded-full hover:bg-gray-100 ${
              copiedShareLink ? 'text-green-600' : 'text-gray-400'
            } transition-colors duration-200`}
            title="Copy share link"
          >
            {copiedShareLink ? <CheckCircle2 size={16} /> : <Share2 size={16} />}
          </button>
          <button
            onClick={() => onDelete(translation.timestamp)}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400"
            title="Delete translation"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(translation.translations).map(([language, data]) => (
          <div key={language} className="bg-white rounded-md p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">
                {languageEmojis[language]} {languages.find(l => l.code === language)?.name}
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleCopy(data.text, language)}
                  className={`p-1.5 rounded-full hover:bg-gray-100 ${
                    copiedStates[language] ? 'text-green-600' : 'text-gray-400'
                  } transition-colors duration-200`}
                  title="Copy translation"
                >
                  {copiedStates[language] ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                </button>
                <button
                  onClick={() => onStatusChange(translation.timestamp, language, 'approved')}
                  className={`p-1.5 rounded-full ${
                    data.status === 'approved'
                      ? 'bg-green-100 text-green-600'
                      : 'hover:bg-gray-100 text-gray-400'
                  }`}
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={() => onStatusChange(translation.timestamp, language, 'rejected')}
                  className={`p-1.5 rounded-full ${
                    data.status === 'rejected'
                      ? 'bg-red-100 text-red-600'
                      : 'hover:bg-gray-100 text-gray-400'
                  }`}
                >
                  <X size={16} />
                </button>
                <button
                  onClick={() => setShowCommentInput({ timestamp: translation.timestamp, language })}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400"
                >
                  <MessageSquare size={16} />
                </button>
              </div>
            </div>

            {editingTranslation?.timestamp === translation.timestamp && 
             editingTranslation?.language === language ? (
              <textarea
                value={editingTranslation.text}
                onChange={(e) => onEdit(translation.timestamp, language, e.target.value)}
                onBlur={onSaveEdit}
                className="w-full p-2 border rounded-md"
                rows={3}
                autoFocus
              />
            ) : (
              <p
                onClick={() => onEdit(translation.timestamp, language, data.text)}
                className="text-gray-600 cursor-pointer hover:bg-gray-50 p-2 rounded"
              >
                {data.text}
              </p>
            )}

            {showCommentInput?.timestamp === translation.timestamp && 
             showCommentInput?.language === language && (
              <div className="mt-2">
                <textarea
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Add a comment..."
                  rows={2}
                />
                <div className="mt-2 flex justify-end space-x-2">
                  <button
                    onClick={() => setShowCommentInput(null)}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleAddComment(translation.timestamp, language)}
                    className="px-3 py-1 text-sm bg-black text-white rounded hover:bg-gray-800"
                  >
                    Add Comment
                  </button>
                </div>
              </div>
            )}

            {data.comment && (
              <TranslationComment 
                comment={data.comment} 
                timestamp={data.commentTimestamp || 0} 
              />
            )}
          </div>
        ))}
      </div>
    </li>
  );
};

export default TranslationItem;