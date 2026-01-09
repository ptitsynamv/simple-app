export interface Book {
  id: string;
  title: string;
  isRead: boolean;
  isFavorite: boolean;
}

export type BookOrder = 'asc' | 'desc';
