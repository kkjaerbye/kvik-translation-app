export interface Comment {
  text: string;
  timestamp: number;
}

export interface TranslationData {
  text: string;
  status: 'pending' | 'approved' | 'rejected';
  comment?: string | Comment;
  commentTimestamp?: number;
}

export interface Translation {
  timestamp: number;
  originalText: string;
  translations: {
    [key: string]: TranslationData;
  };
}