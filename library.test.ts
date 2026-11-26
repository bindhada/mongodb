
import { describe, test, expect } from "vitest";
import { findBook, checkOutBook } from "./library";

describe("Library Unit Tests", () => {
  test("findBook returns dune", () => {
    expect(findBook("dune")).toEqual({
      title: "dune",
      copiesAvailable: 3,
    });
  });

  test("findBook returns foundation even with zero copies", () => {
    expect(findBook("foundation")).toEqual({
      title: "foundation",
      copiesAvailable: 0,
    });
  });

  test("findBook throws for an unknown book", () => {
    expect(() => findBook("harry potter")).toThrow();
  });

  test("findBook throws for a number", () => {
    expect(() => findBook(42)).toThrow();
  });
});

  // Exercise 5: checkOutBook

  test("checkOutBook returns a number", () => {
    const loanId = checkOutBook({
      title: "dune",
      copiesAvailable: 3,
    });

    expect(typeof loanId).toBe("number");
  });

  test("checkOutBook returns a whole number", () => {
    const loanId = checkOutBook({
      title: "dune",
      copiesAvailable: 3,
    });

    expect(Number.isInteger(loanId)).toBe(true);
  });

  test("checkOutBook returns a number between 1000 and 9999", () => {
    const loanId = checkOutBook({
      title: "dune",
      copiesAvailable: 3,
    });

    expect(loanId).toBeGreaterThanOrEqual(1000);
    expect(loanId).toBeLessThanOrEqual(9999);
  });

  test("checkOutBook throws when no copies are available", () => {
    expect(() =>
      checkOutBook({
        title: "foundation",
        copiesAvailable: 0,
      })
    ).toThrow("No copies available");
  });

  test("checkOutBook throws when copiesAvailable is missing", () => {
    expect(() =>
      checkOutBook({
        title: "dune",
      })
    ).toThrow();
  });
