export interface Comment {
  id: number;
  comment: string;
  votes: number;
  created_at: string;
  user: User;
  replies?: CommentReply[];
}

export interface User {
  id: string;
  name: string;
  username: string;
}

export interface CommentReply {
  id: number;
  comment: string;
  votes: number;
  created_at: string;
  user: User;
  replies?: CommentReply[];
}
