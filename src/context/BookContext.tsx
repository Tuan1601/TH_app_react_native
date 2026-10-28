import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {Book, BookInput} from '../types/book';
import {
  createInitialBooks,
  readBooks,
  writeBooks,
} from '../services/bookStorage';

type BookContextValue = {
  books: Book[];
  isLoading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  addBook: (input: BookInput) => Promise<void>;
  updateBook: (id: string, input: BookInput) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  borrowBook: (id: string) => Promise<void>;
  returnBook: (id: string) => Promise<void>;
};

const BookContext = createContext<BookContextValue | undefined>(undefined);

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Đã xảy ra lỗi khi cập nhật thư viện.';
}

export function BookProvider({children}: PropsWithChildren): React.JSX.Element {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const booksRef = useRef<Book[]>([]);
  const hasLoadedRef = useRef(false);
  const mutationQueue = useRef<Promise<void>>(Promise.resolve());
  const mountedRef = useRef(true);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let storedBooks = await readBooks();
      if (storedBooks === null) {
        storedBooks = createInitialBooks();
        await writeBooks(storedBooks);
      }
      booksRef.current = storedBooks;
      hasLoadedRef.current = true;
      if (mountedRef.current) {
        setBooks(storedBooks);
      }
    } catch (loadError) {
      hasLoadedRef.current = false;
      if (mountedRef.current) {
        setError(getErrorMessage(loadError));
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    reload();
    return () => {
      mountedRef.current = false;
    };
  }, [reload]);

  const mutate = useCallback(
    <T,>(update: (currentBooks: Book[]) => {books: Book[]; result: T}): Promise<T> => {
      const task = mutationQueue.current.then(async () => {
        if (!hasLoadedRef.current) {
          throw new Error('Thư viện chưa sẵn sàng. Vui lòng thử lại.');
        }
        const {books: nextBooks, result} = update(booksRef.current);
        await writeBooks(nextBooks);
        booksRef.current = nextBooks;
        if (mountedRef.current) {
          setBooks(nextBooks);
        }
        return result;
      });
      mutationQueue.current = task.then(
        () => undefined,
        () => undefined,
      );
      return task;
    },
    [],
  );

  const addBook = useCallback(
    (input: BookInput) =>
      mutate(currentBooks => {
        let id = Date.now().toString();
        let suffix = 1;
        while (currentBooks.some(book => book.id === id)) {
          id = `${Date.now()}-${suffix}`;
          suffix += 1;
        }
        return {
          books: [...currentBooks, {...input, id, borrowed: 0}],
          result: undefined,
        };
      }),
    [mutate],
  );

  const updateBook = useCallback(
    (id: string, input: BookInput) =>
      mutate(currentBooks => {
        const existingBook = currentBooks.find(book => book.id === id);
        if (!existingBook) {
          throw new Error('Không tìm thấy sách cần cập nhật.');
        }
        if (input.quantity < existingBook.borrowed) {
          throw new Error(
            `Số lượng không thể nhỏ hơn ${existingBook.borrowed} cuốn đang được mượn.`,
          );
        }
        return {
          books: currentBooks.map(book =>
            book.id === id ? {...book, ...input, borrowed: existingBook.borrowed} : book,
          ),
          result: undefined,
        };
      }),
    [mutate],
  );

  const deleteBook = useCallback(
    (id: string) =>
      mutate(currentBooks => {
        const book = currentBooks.find(item => item.id === id);
        if (!book) {
          throw new Error('Sách này không còn trong thư viện.');
        }
        if (book.borrowed > 0) {
          throw new Error('Không thể xóa sách đang có người mượn.');
        }
        return {
          books: currentBooks.filter(item => item.id !== id),
          result: undefined,
        };
      }),
    [mutate],
  );

  const borrowBook = useCallback(
    (id: string) =>
      mutate(currentBooks => {
        const book = currentBooks.find(item => item.id === id);
        if (!book) {
          throw new Error('Sách này không còn trong thư viện.');
        }
        if (book.borrowed >= book.quantity) {
          throw new Error('Sách đã hết, không thể cho mượn thêm.');
        }
        return {
          books: currentBooks.map(item =>
            item.id === id ? {...item, borrowed: item.borrowed + 1} : item,
          ),
          result: undefined,
        };
      }),
    [mutate],
  );

  const returnBook = useCallback(
    (id: string) =>
      mutate(currentBooks => {
        const book = currentBooks.find(item => item.id === id);
        if (!book) {
          throw new Error('Sách này không còn trong thư viện.');
        }
        if (book.borrowed === 0) {
          throw new Error('Không có cuốn sách nào đang được mượn để nhận trả.');
        }
        return {
          books: currentBooks.map(item =>
            item.id === id ? {...item, borrowed: item.borrowed - 1} : item,
          ),
          result: undefined,
        };
      }),
    [mutate],
  );

  return (
    <BookContext.Provider
      value={{
        books,
        isLoading,
        error,
        reload,
        addBook,
        updateBook,
        deleteBook,
        borrowBook,
        returnBook,
      }}>
      {children}
    </BookContext.Provider>
  );
}

export function useBooks(): BookContextValue {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBooks phải được sử dụng bên trong BookProvider.');
  }
  return context;
}
