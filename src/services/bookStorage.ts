import AsyncStorage from '@react-native-async-storage/async-storage';
import {Book, bookCategories} from '../types/book';

const STORAGE_KEY = '@library_app/books';

const initialBooks: Book[] = [
  {
    id: 'seed-1',
    title: 'Lập trình React Native thực chiến',
    author: 'Nguyễn Văn An',
    category: 'Giáo trình',
    year: 2023,
    quantity: 10,
    borrowed: 4,
  },
  {
    id: 'seed-2',
    title: 'Dế Mèn Phiêu Lưu Ký',
    author: 'Tô Hoài',
    category: 'Thiếu nhi',
    year: 2021,
    quantity: 5,
    borrowed: 5,
  },
  {
    id: 'seed-3',
    title: 'Vũ Trụ Trong Vỏ Hạt Dẻ',
    author: 'Stephen Hawking',
    category: 'Khoa học',
    year: 2020,
    quantity: 8,
    borrowed: 2,
  },
  {
    id: 'seed-4',
    title: 'Số Đỏ',
    author: 'Vũ Trọng Phụng',
    category: 'Tiểu thuyết',
    year: 2022,
    quantity: 4,
    borrowed: 1,
  },
  {
    id: 'seed-5',
    title: 'Giải tích và Đại số tuyến tính',
    author: 'Trần Minh Bảo',
    category: 'Giáo trình',
    year: 2024,
    quantity: 7,
    borrowed: 0,
  },
];

function isBook(value: unknown): value is Book {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const book = value as Record<string, unknown>;
  return (
    typeof book.id === 'string' &&
    typeof book.title === 'string' &&
    typeof book.author === 'string' &&
    bookCategories.includes(book.category as (typeof bookCategories)[number]) &&
    Number.isInteger(book.year) &&
    Number.isInteger(book.quantity) &&
    Number.isInteger(book.borrowed) &&
    (book.title as string).trim().length > 0 &&
    (book.author as string).trim().length > 0 &&
    (book.year as number) >= 1900 &&
    (book.year as number) <= new Date().getFullYear() &&
    (book.borrowed as number) >= 0 &&
    (book.quantity as number) > 0 &&
    (book.borrowed as number) <= (book.quantity as number)
  );
}

export async function readBooks(): Promise<Book[] | null> {
  const storedValue = await AsyncStorage.getItem(STORAGE_KEY);
  if (storedValue === null) {
    return null;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(storedValue);
  } catch {
    throw new Error('Dữ liệu thư viện bị lỗi định dạng và không thể khôi phục.');
  }

  if (!Array.isArray(parsed) || !parsed.every(isBook)) {
    throw new Error('Dữ liệu thư viện không hợp lệ và không thể khôi phục.');
  }

  return parsed;
}

export async function writeBooks(books: Book[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

export function createInitialBooks(): Book[] {
  return initialBooks.map(book => ({...book}));
}
