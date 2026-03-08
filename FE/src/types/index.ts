export interface User {
  _id: string;
  provider: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  createdAt: string;
  isAdmin?: boolean;
}

export interface GuestbookMessage {
  _id: string;
  userId: string | {
    _id: string;
    name: string;
    avatarUrl?: string;
  };
  message: string;
  createdAt: string;
}

export interface TechStackCategory {
  _id: string;
  name: string;
  items: string[];
  displayOrder: number;
}
