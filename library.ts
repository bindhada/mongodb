
import { z } from "zod";

// Book title schema
export const BookTitleSchema = z.enum([
  "dune",
  "neuromancer",
  "foundation",
]);

// Book schema
export const BookSchema = z.object({
  title: BookTitleSchema,
  copiesAvailable: z.number().int().nonnegative(),
});

// Type inferred from schema
export type Book = z.infer<typeof BookSchema>;

// Library catalogue
const catalogue = {
  dune: { title: "dune", copiesAvailable: 3 },
  neuromancer: { title: "neuromancer", copiesAvailable: 1 },
  foundation: { title: "foundation", copiesAvailable: 0 },
};

// Find a book
export const findBook = (title: unknown): Book => {
  const validTitle = BookTitleSchema.parse(title);

  return BookSchema.parse(catalogue[validTitle]);
};

export const checkOutBook = (book: any): number => {
  if (book.copiesAvailable === undefined) {
    throw new Error("copiesAvailable is missing");
  }

  if (book.copiesAvailable <= 0) {
    throw new Error("No copies available");
  }

  const loanId = Math.floor(Math.random() * 9000) + 1000;

  return loanId;
};
