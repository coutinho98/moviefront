export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface CommentHistory {
  id: string;
  content: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  movieId: string;
  user: User;
  updatedAt: string;
  history: CommentHistory[];
}

export interface Vote {
  id: string;
  value: number;
  userId: string;
  movieId: string;
}

export interface Movie {
  id: string;
  title: string;
  posterUrl?: string;
  averageScore: number;
  numVotes: number;
  percentage: number;
  Vote: Vote[];
  Comment: Comment[];
}
