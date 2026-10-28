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
  loans: BookLoan[];
};

export type BookLoan = {
  id: string;
  borrowerName: string;
  borrowedAt: string;
};

export type BookInput = Pick<Book, 'title' | 'author' | 'category' | 'year' | 'quantity'>;

export type BookFormValues = {
  title: string;
  author: string;
  category: BookCategory;
  year: string;
  quantity: string;
};
