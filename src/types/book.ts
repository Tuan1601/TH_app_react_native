export const bookCategories = [
  'Giáo trình',
  'Tiểu thuyết',
  'Khoa học',
  'Thiếu nhi',
] as const;

export type BookCategory = (typeof bookCategories)[number];

export type Book = {
  id: string;
  title: string;
  author: string;
  category: BookCategory;
  year: number;
  quantity: number;
  borrowed: number;
};

export type BookInput = Omit<Book, 'id' | 'borrowed'>;

export type BookFormValues = {
  title: string;
  author: string;
  category: BookCategory;
  year: string;
  quantity: string;
};
