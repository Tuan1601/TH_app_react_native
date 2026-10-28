export type RootStackParamList = {
  BookList: undefined;
  BookForm: {bookId?: string} | undefined;
  BookDetail: {bookId: string};
  Borrowing: {bookId?: string} | undefined;
};
