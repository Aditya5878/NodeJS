import express from "express";
import type { Request, Response } from "express";
import { books } from "../db/book";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.json(books);
});

router.get("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const book = books.find(b => b.id === id);
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  res.json(book);
});

router.post("/", (req: Request, res: Response) => {
  const { id, title, author } = req.body;

  if (!id || !title || !author) {
    return res.status(400).json({ message: "Invalid book data" });
  }

  books.push({ id, title, author });

  res.status(201).json({ message: "Book added" });
});

router.delete("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const index = books.findIndex(b => b.id === id);
  if (index < 0) {
    return res.status(404).json({ message: "Invalid id" });
  }

  books.splice(index, 1);
  res.json({ message: "Deleted" });
});

export default router;
