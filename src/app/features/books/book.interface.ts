export interface Book {
  id: string;
  title: string;
  isRead: boolean;
  isFavorite: boolean;
}

export type BookOrder = 'asc' | 'desc';

export type CreateBook = Omit<Book, 'id'>;
