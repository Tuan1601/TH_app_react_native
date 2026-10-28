import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactTestRenderer from 'react-test-renderer';
import {BookProvider, useBooks} from '../src/context/BookContext';
import {readBooks} from '../src/services/bookStorage';
import {Book} from '../src/types/book';

let library: ReturnType<typeof useBooks> | undefined;

function LibraryReader(): React.JSX.Element {
  library = useBooks();
  return <></>;
}

beforeEach(async () => {
  await AsyncStorage.clear();
  library = undefined;
});

test('records a named borrower and returns the matching loan', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer | null = null;
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(
      <BookProvider>
        <LibraryReader />
      </BookProvider>,
    );
  });

  if (!library || !renderer) {
    throw new Error('Book context was not initialized.');
  }

  const bookId = 'seed-5';
  await ReactTestRenderer.act(async () => {
    await library?.borrowBook(bookId, '  Nguyễn Minh An  ');
  });

  const borrowedBook = library.books.find(book => book.id === bookId);
  expect(borrowedBook?.borrowed).toBe(1);
  expect(borrowedBook?.loans).toHaveLength(1);
  expect(borrowedBook?.loans[0].borrowerName).toBe('Nguyễn Minh An');

  await ReactTestRenderer.act(async () => {
    await library?.returnBook(bookId, borrowedBook?.loans[0].id ?? '');
  });
  const returnedBook = library.books.find(book => book.id === bookId);
  expect(returnedBook?.borrowed).toBe(0);
  expect(returnedBook?.loans).toHaveLength(0);

  await expect(library.deleteBook('seed-1')).rejects.toThrow(
    'Không thể xóa sách đang có người mượn.',
  );
  await ReactTestRenderer.act(async () => {
    await library?.deleteBook(bookId);
  });
  expect(library.books.some(book => book.id === bookId)).toBe(false);

  await ReactTestRenderer.act(async () => {
    renderer?.unmount();
  });
});

test('migrates existing borrowed counts into named loan entries', async () => {
  const previousBooks = [
    {
      id: 'legacy-book',
      title: 'Sách cũ',
      author: 'Tác giả',
      category: 'Khoa học',
      year: 2020,
      quantity: 3,
      borrowed: 2,
    },
  ];
  await AsyncStorage.setItem('@library_app/books', JSON.stringify(previousBooks));

  const migratedBooks = await readBooks();
  if (!migratedBooks) {
    throw new Error('Stored legacy books were not loaded.');
  }
  const migratedBook: Book = migratedBooks[0];

  expect(migratedBook.loans).toHaveLength(2);
  expect(migratedBook.loans[0].borrowerName).toBe('Chưa cập nhật tên người mượn');
  const savedValue = await AsyncStorage.getItem('@library_app/books');
  const savedBooks: Array<{loans: unknown[]}> = JSON.parse(savedValue ?? '[]');
  expect(savedBooks[0].loans).toHaveLength(2);
});

test('restores seed loans for seed books with placeholder borrower names', async () => {
  const seedWithPlaceholders = [
    {
      id: 'seed-1',
      title: 'Lập trình React Native thực chiến',
      author: 'Nguyễn Văn An',
      category: 'Giáo trình',
      year: 2023,
      quantity: 10,
      borrowed: 4,
      loans: [
        {id: 'legacy-seed-1-1', borrowerName: 'Chưa cập nhật tên người mượn', borrowedAt: '2026-10-28'},
      ],
    },
  ];
  // Change borrowed to 4 placeholder loans
  seedWithPlaceholders[0].loans = Array.from({length: 4}, (_, i) => ({
    id: `legacy-seed-1-${i + 1}`,
    borrowerName: 'Chưa cập nhật tên người mượn',
    borrowedAt: '2026-10-28',
  }));

  await AsyncStorage.setItem('@library_app/books', JSON.stringify(seedWithPlaceholders));

  const migratedBooks = await readBooks();
  expect(migratedBooks?.[0].loans[0].borrowerName).toBe('Nguyễn Minh Anh');
  expect(migratedBooks?.[0].loans[1].borrowerName).toBe('Trần Quốc Bảo');
});

