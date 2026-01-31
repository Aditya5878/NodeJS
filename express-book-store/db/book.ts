export type Book = {
  id: number;
  title: string;
  author: string;
};

export const books: Book[] = [];

// in-memory DB
books.push({ id: 1, title: "Book One", author: "Author one" });
books.push({ id: 2, title: "Book Two", author: "Author two" });
