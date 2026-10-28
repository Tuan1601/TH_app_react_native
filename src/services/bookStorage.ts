import AsyncStorage from '@react-native-async-storage/async-storage';
import {Book, BookLoan, bookCategories} from '../types/book';

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
    loans: [
      {id: 'seed-1-loan-1', borrowerName: 'Nguyễn Minh Anh', borrowedAt: '2026-10-24'},
      {id: 'seed-1-loan-2', borrowerName: 'Trần Quốc Bảo', borrowedAt: '2026-10-25'},
      {id: 'seed-1-loan-3', borrowerName: 'Lê Thu Hà', borrowedAt: '2026-10-26'},
      {id: 'seed-1-loan-4', borrowerName: 'Phạm Gia Huy', borrowedAt: '2026-10-27'},
    ],
  },
  {
    id: 'seed-2',
    title: 'Dế Mèn Phiêu Lưu Ký',
    author: 'Tô Hoài',
    category: 'Thiếu nhi',
    year: 2021,
    quantity: 5,
    borrowed: 5,
    loans: [
      {id: 'seed-2-loan-1', borrowerName: 'Võ Ngọc Mai', borrowedAt: '2026-10-21'},
      {id: 'seed-2-loan-2', borrowerName: 'Nguyễn Hoàng Long', borrowedAt: '2026-10-22'},
      {id: 'seed-2-loan-3', borrowerName: 'Đặng Khánh Linh', borrowedAt: '2026-10-23'},
      {id: 'seed-2-loan-4', borrowerName: 'Bùi Đức Minh', borrowedAt: '2026-10-24'},
      {id: 'seed-2-loan-5', borrowerName: 'Phan Thanh Tâm', borrowedAt: '2026-10-25'},
    ],
  },
  {
    id: 'seed-3',
    title: 'Vũ Trụ Trong Vỏ Hạt Dẻ',
    author: 'Stephen Hawking',
    category: 'Khoa học',
    year: 2020,
    quantity: 8,
    borrowed: 2,
    loans: [
      {id: 'seed-3-loan-1', borrowerName: 'Hoàng Nhật Nam', borrowedAt: '2026-10-25'},
      {id: 'seed-3-loan-2', borrowerName: 'Đỗ Phương Thảo', borrowedAt: '2026-10-26'},
    ],
  },
  {
    id: 'seed-4',
    title: 'Số Đỏ',
    author: 'Vũ Trọng Phụng',
    category: 'Tiểu thuyết',
    year: 2022,
    quantity: 4,
    borrowed: 1,
    loans: [{id: 'seed-4-loan-1', borrowerName: 'Trương Hải Yến', borrowedAt: '2026-10-26'}],
  },
  {
    id: 'seed-5',
    title: 'Giải tích và Đại số tuyến tính',
    author: 'Trần Minh Bảo',
    category: 'Giáo trình',
    year: 2024,
    quantity: 7,
    borrowed: 0,
    loans: [],
  },
];

function isLoan(value: unknown): value is BookLoan {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const loan = value as Record<string, unknown>;
  return (
    typeof loan.id === 'string' &&
    typeof loan.borrowerName === 'string' &&
    loan.borrowerName.trim().length > 0 &&
    typeof loan.borrowedAt === 'string'
  );
}

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
    (book.borrowed as number) <= (book.quantity as number) &&
    Array.isArray(book.loans) &&
    book.loans.every(isLoan) &&
    book.loans.length === book.borrowed
  );
}

function migrateBook(value: unknown): Book | null {
  if (typeof value !== 'object' || value === null) {
    return null;
  }
  const record = value as Record<string, unknown>;
  const seedBook = initialBooks.find(b => b.id === record.id);

  if (Array.isArray(record.loans)) {
    if (
      seedBook &&
      record.borrowed === seedBook.borrowed &&
      record.loans.some(
        loan =>
          typeof loan === 'object' &&
          loan !== null &&
          ((loan as Record<string, unknown>).borrowerName ===
            'Chưa cập nhật tên người mượn' ||
            String((loan as Record<string, unknown>).id).startsWith('legacy-')),
      )
    ) {
      const updated: Record<string, unknown> = {
        ...record,
        loans: seedBook.loans.map(loan => ({...loan})),
      };
      return isBook(updated) ? updated : null;
    }
    return isBook(record) ? record : null;
  }
  if (
    typeof record.id !== 'string' ||
    typeof record.borrowed !== 'number' ||
    !Number.isSafeInteger(record.borrowed) ||
    record.borrowed < 0 ||
    typeof record.quantity !== 'number' ||
    !Number.isSafeInteger(record.quantity) ||
    record.quantity <= 0 ||
    record.borrowed > record.quantity
  ) {
    return null;
  }
  if (seedBook && record.borrowed === seedBook.borrowed) {
    const migrated: Record<string, unknown> = {
      ...record,
      loans: seedBook.loans.map(loan => ({...loan})),
    };
    return isBook(migrated) ? migrated : null;
  }
  const migrated: Record<string, unknown> = {
    ...record,
    loans: Array.from({length: record.borrowed}, (_, index) => ({
      id: `legacy-${record.id}-${index + 1}`,
      borrowerName: 'Chưa cập nhật tên người mượn',
      borrowedAt: new Date().toISOString().slice(0, 10),
    })),
  };
  return isBook(migrated) ? migrated : null;
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

  if (!Array.isArray(parsed)) {
    throw new Error('Dữ liệu thư viện không hợp lệ và không thể khôi phục.');
  }

  const migratedBooks = parsed.map(migrateBook);
  if (migratedBooks.some(book => book === null)) {
    throw new Error('Dữ liệu thư viện không hợp lệ và không thể khôi phục.');
  }
  const books = migratedBooks.filter((book): book is Book => book !== null);
  const needsSave =
    parsed.length !== books.length ||
    JSON.stringify(parsed) !== JSON.stringify(books);
  if (needsSave) {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }
  return books;
}

export async function writeBooks(books: Book[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

export function createInitialBooks(): Book[] {
  return initialBooks.map(book => ({...book}));
}
