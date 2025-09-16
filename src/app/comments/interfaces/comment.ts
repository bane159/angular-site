export interface Comment {
  id: number;
  comment: string;
  votes: number;
  created_at: string;
  user: {
    id: number;
    name: string;
    username: string;
  };
  replies?: CommentReply[];
}

export interface TopComment {
  id: number;
  comment: string;
  votes: number;
  created_at: string;
  user: {
    id: number;
    name: string;
    username: string;
  };
  replies: CommentReply[];
}

export interface Answer {
  id: number;
  comment: string;
  votes: number;
  created_at: string;
  user: {
    id: number;
    name: string;
    username: string;
  };
  replies?: CommentReply[];
}

export interface CommentReply {
  id: number;
  comment: string;
  votes: number;
  created_at: string;
  user: {
    id: number;
    name: string;
    username: string;
  };
  replies?: CommentReply[];
}
