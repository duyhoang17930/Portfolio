export interface User {
  id: number;
  provider: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  createdAt: string;
  isAdmin?: boolean;
}

export interface GuestbookMessage {
  id: number;
  userId: number;
  message: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    avatarUrl?: string;
  };
}
