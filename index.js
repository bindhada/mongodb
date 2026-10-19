
import "dotenv/config";
import express from "express";
import mongoose from "./db.js";

import Book from "./models/Book.js";
import Author from "./models/Author.js";
import Member from "./models/Member.js";
import Loan from "./models/Loan.js";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Reusable validation helpers
function validId(id) {
  return mongoose.isValidObjectId(id);
}

function sendError(res, error) {
  if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }

  if (error.name === "CastError") {
    return res.status(400).json({ error: "Invalid ID or field value" });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      error: "A record with this unique value already exists",
    });
  }

  console.error(error);
  return res.status(500).json({ error: "Internal server error" });
}

function invalidIdResponse(res) {
  return res.status(400).json({ error: "Invalid ID format" });
}

// --------------------
// EXERCISES 1, 2, 4, 5, 6
// BOOK ROUTES
// --------------------

// GET /books?genre=fantasy&sort=publishedYear&page=1&limit=10
app.get("/books", async (req, res) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    if (
      !Number.isInteger(page) ||
      !Number.isInteger(limit) ||
      page < 1 ||
      limit < 1 ||
      limit > 100
    ) {
      return res.status(400).json({
        error: "page must be >= 1 and limit must be between 1 and 100",
      });
    }

    const filter = {};

    if (req.query.genre) {
      filter.genre = String(req.query.genre).toLowerCase().trim();
    }

    // Optional author filter
    if (req.query.author) {
      if (!validId(req.query.author)) {
        return invalidIdResponse(res);
      }
      filter.author = req.query.author;
    }

    const allowedSortFields = [
      "title",
      "genre",
      "publishedYear",
      "createdAt",
      "updatedAt",
    ];

    const sortField = req.query.sort || "createdAt";

    if (!allowedSortFields.includes(sortField)) {
      return res.status(400).json({
        error: `sort must be one of: ${allowedSortFields.join(", ")}`,
      });
    }

    // Ascending by default; ?order=desc reverses the sort
    const sortDirection =
      String(req.query.order || "asc").toLowerCase() === "desc" ? -1 : 1;

    const [total, data] = await Promise.all([
      Book.countDocuments(filter),
      Book.find(filter)
        .populate("author")
        .sort({ [sortField]: sortDirection, _id: 1 })
        .skip((page - 1) * limit)
        .limit(limit),
    ]);

    return res.json({ page, limit, total, data });
  } catch (error) {
    return sendError(res, error);
  }
});

// POST /books
app.post("/books", async (req, res) => {
  try {
    const { title, genre, publishedYear, author } = req.body;

    if (author != null) {
      if (!validId(author)) {
        return invalidIdResponse(res);
      }

      const authorExists = await Author.exists({ _id: author });

      if (!authorExists) {
        return res.status(400).json({ error: "Author does not exist" });
      }
    }

    const book = new Book({
      title,
      genre,
      publishedYear,
      ...(author != null ? { author } : {}),
    });

    await book.save();
    await book.populate("author");

    return res.status(201).json(book);
  } catch (error) {
    return sendError(res, error);
  }
});

// GET /books/:id
app.get("/books/:id", async (req, res) => {
  try {
    if (!validId(req.params.id)) return invalidIdResponse(res);

    const book = await Book.findById(req.params.id).populate("author");

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    return res.json(book);
  } catch (error) {
    return sendError(res, error);
  }
});

// PUT /books/:id
app.put("/books/:id", async (req, res) => {
  try {
    if (!validId(req.params.id)) return invalidIdResponse(res);

    const { title, genre, publishedYear, author } = req.body;

    // Prevent clients from changing timestamps or arbitrary fields.
    const updates = {};

    if (title !== undefined) updates.title = title;
    if (genre !== undefined) updates.genre = genre;
    if (publishedYear !== undefined) {
      updates.publishedYear = publishedYear;
    }

    if (author !== undefined) {
      if (author !== null) {
        if (!validId(author)) return invalidIdResponse(res);

        const authorExists = await Author.exists({ _id: author });

        if (!authorExists) {
          return res.status(400).json({ error: "Author does not exist" });
        }
      }

      updates.author = author;
    }

    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    ).populate("author");

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    return res.json(book);
  } catch (error) {
    return sendError(res, error);
  }
});

// DELETE /books/:id
app.delete("/books/:id", async (req, res) => {
  try {
    if (!validId(req.params.id)) return invalidIdResponse(res);

    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    return res.json({ message: "Book deleted successfully", book });
  } catch (error) {
    return sendError(res, error);
  }
});

// --------------------
// EXERCISE 6
// AUTHOR ROUTES
// --------------------

app.post("/authors", async (req, res) => {
  try {
    const author = new Author({ name: req.body.name });
    await author.save();

    return res.status(201).json(author);
  } catch (error) {
    return sendError(res, error);
  }
});

app.get("/authors", async (req, res) => {
  try {
    const authors = await Author.find().sort({ name: 1 });
    return res.json(authors);
  } catch (error) {
    return sendError(res, error);
  }
});

app.get("/authors/:id/books", async (req, res) => {
  try {
    if (!validId(req.params.id)) return invalidIdResponse(res);

    const author = await Author.findById(req.params.id);

    if (!author) {
      return res.status(404).json({ error: "Author not found" });
    }

    const books = await Book.find({ author: author._id })
      .populate("author")
      .sort({ title: 1 });

    return res.json({ author, books });
  } catch (error) {
    return sendError(res, error);
  }
});

// --------------------
// EXERCISE 7
// MEMBER ROUTES
// --------------------

app.post("/members", async (req, res) => {
  try {
    const member = new Member({
      name: req.body.name,
      email: req.body.email,
    });

    await member.save();
    return res.status(201).json(member);
  } catch (error) {
    return sendError(res, error);
  }
});

app.get("/members", async (req, res) => {
  try {
    const members = await Member.find().sort({ name: 1 });
    return res.json(members);
  } catch (error) {
    return sendError(res, error);
  }
});

app.get("/members/:id", async (req, res) => {
  try {
    if (!validId(req.params.id)) return invalidIdResponse(res);

    const member = await Member.findById(req.params.id)
      .populate("recentLoans.book");

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    return res.json(member);
  } catch (error) {
    return sendError(res, error);
  }
});

// --------------------
// EXERCISE 7
// REFERENCED LOAN ROUTES
// --------------------

// POST /loans
app.post("/loans", async (req, res) => {
  try {
    const { book, member } = req.body;

    if (!book || !member || !validId(book) || !validId(member)) {
      return res.status(400).json({
        error: "Valid book and member IDs are required",
      });
    }

    // Mongoose references do not enforce foreign keys.
    const [bookExists, memberExists] = await Promise.all([
      Book.exists({ _id: book }),
      Member.exists({ _id: member }),
    ]);

    if (!bookExists) {
      return res.status(400).json({ error: "Book does not exist" });
    }

    if (!memberExists) {
      return res.status(400).json({ error: "Member does not exist" });
    }

    // An unreturned loan prevents another member borrowing the same book.
    const activeLoan = await Loan.findOne({
      book,
      returnedAt: null,
    });

    if (activeLoan) {
      return res.status(409).json({
        error: "This book is already on loan",
      });
    }

    const loan = new Loan({ book, member });
    await loan.save();
    await loan.populate(["book", "member"]);

    return res.status(201).json(loan);
  } catch (error) {
    return sendError(res, error);
  }
});

// PATCH /loans/:id/return
app.patch("/loans/:id/return", async (req, res) => {
  try {
    if (!validId(req.params.id)) return invalidIdResponse(res);

    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({ error: "Loan not found" });
    }

    if (loan.returnedAt !== null) {
      return res.status(409).json({ error: "Loan already returned" });
    }

    loan.returnedAt = new Date();
    await loan.save();
    await loan.populate(["book", "member"]);

    return res.json(loan);
  } catch (error) {
    return sendError(res, error);
  }
});

// GET /members/:id/loans
app.get("/members/:id/loans", async (req, res) => {
  try {
    if (!validId(req.params.id)) return invalidIdResponse(res);

    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    const loans = await Loan.find({ member: member._id })
      .populate("book")
      .sort({ borrowedAt: -1 });

    return res.json({ member, loans });
  } catch (error) {
    return sendError(res, error);
  }
});

// --------------------
// EXERCISE 8
// AGGREGATION STATISTICS
// --------------------

// GET /stats/genres
app.get("/stats/genres", async (req, res) => {
  try {
    const stats = await Book.aggregate([
      {
        $group: {
          _id: "$genre",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1, _id: 1 } },
      {
        $project: {
          _id: 0,
          genre: "$_id",
          count: 1,
        },
      },
    ]);

    return res.json(stats);
  } catch (error) {
    return sendError(res, error);
  }
});

// GET /stats/top-authors
app.get("/stats/top-authors", async (req, res) => {
  try {
    const stats = await Book.aggregate([
      { $match: { author: { $ne: null } } },
      {
        $group: {
          _id: "$author",
          bookCount: { $sum: 1 },
        },
      },
      { $sort: { bookCount: -1, _id: 1 } },
      {
        $lookup: {
          from: Author.collection.name,
          localField: "_id",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },
      {
        $project: {
          _id: 0,
          authorId: "$author._id",
          name: "$author.name",
          bookCount: 1,
        },
      },
    ]);

    return res.json(stats);
  } catch (error) {
    return sendError(res, error);
  }
});

// --------------------
// EXERCISE 9
// EMBEDDED LOANS
// --------------------

// POST /members/:id/embedded-loans
app.post("/members/:id/embedded-loans", async (req, res) => {
  try {
    if (!validId(req.params.id)) return invalidIdResponse(res);

    const { book } = req.body;

    if (!book || !validId(book)) {
      return res.status(400).json({ error: "A valid book ID is required" });
    }

    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    const bookExists = await Book.exists({ _id: book });

    if (!bookExists) {
      return res.status(400).json({ error: "Book does not exist" });
    }

    // Enforce the same one-active-loan-per-book rule.
    const activeReferencedLoan = await Loan.findOne({
      book,
      returnedAt: null,
    });

    const activeEmbeddedLoan = await Member.findOne({
      "recentLoans.book": book,
      "recentLoans.returnedAt": null,
    });

    if (activeReferencedLoan || activeEmbeddedLoan) {
      return res.status(409).json({
        error: "This book is already on loan",
      });
    }

    member.recentLoans.push({ book, borrowedAt: new Date() });

    // Keep only the latest 10 embedded entries.
    if (member.recentLoans.length > 10) {
      member.recentLoans = member.recentLoans.slice(-10);
    }

    await member.save();
    await member.populate("recentLoans.book");

    return res.status(201).json(member);
  } catch (error) {
    return sendError(res, error);
  }
});

// GET /members/:id/embedded-loans
app.get("/members/:id/embedded-loans", async (req, res) => {
  try {
    if (!validId(req.params.id)) return invalidIdResponse(res);

    const member = await Member.findById(req.params.id)
      .populate("recentLoans.book");

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    return res.json({
      memberId: member._id,
      name: member.name,
      recentLoans: member.recentLoans,
    });
  } catch (error) {
    return sendError(res, error);
  }
});

// PATCH /members/:memberId/embedded-loans/:loanId/return
app.patch(
  "/members/:memberId/embedded-loans/:loanId/return",
  async (req, res) => {
    try {
      const { memberId, loanId } = req.params;

      if (!validId(memberId) || !validId(loanId)) {
        return invalidIdResponse(res);
      }

      const member = await Member.findById(memberId);

      if (!member) {
        return res.status(404).json({ error: "Member not found" });
      }

      const embeddedLoan = member.recentLoans.id(loanId);

      if (!embeddedLoan) {
        return res.status(404).json({ error: "Embedded loan not found" });
      }

      if (embeddedLoan.returnedAt !== null) {
        return res.status(409).json({ error: "Loan already returned" });
      }

      embeddedLoan.returnedAt = new Date();
      await member.save();
      await member.populate("recentLoans.book");

      return res.json(member);
    } catch (error) {
      return sendError(res, error);
    }
  }
);

// Unknown API endpoint
app.use((req, res) => {
  return res.status(404).json({ error: "Route not found" });
});

// Handle malformed JSON sent to express.json()
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  return res.status(500).json({ error: "Internal server error" });
});

// Start the server after the database connects.
mongoose.connection.asPromise()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Library API listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Cannot start API without MongoDB:", error.message);
    process.exitCode = 1;
  });
