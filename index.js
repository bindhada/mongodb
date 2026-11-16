
import { z, ZodError } from 'zod';
import { reportError } from './utils/reportError.js';
import './instrument.js';

import 'dotenv/config';
import express from 'express';
import * as Sentry from '@sentry/node';
import { pathToFileURL } from 'node:url';

import sequelize from './sequelize.js';
import { Book, Author, Member, Loan } from './models/index.js';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const bookSchema = z.object({
  title: z.string().min(1),
  genre: z.string().min(1),
  published_year: z.number().int(),
  author_id: z.number().int().positive().optional()
});

function sendError(res, error, feature) {
  console.error(error);
  reportError(error, feature);

  if (
    error.name === 'SequelizeValidationError' ||
    error.name === 'SequelizeUniqueConstraintError' ||
    error.name === 'SequelizeForeignKeyConstraintError'
  ) {
    return res.status(400).json({
      error: error.message
    });
  }

  return res.status(500).json({
    error: 'Internal server error'
  });
}

// Sentry debug route
if (process.env.NODE_ENV !== 'production') {
  app.get('/debug-sentry', (req, res) => {
    throw new Error('My first Sentry error!');
  });
}

// GET /books
app.get('/books', async (req, res) => {
  Sentry.addBreadcrumb({
    message: 'Fetch books route',
    level: 'info'
  });

  Sentry.setTag('feature', 'books');

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
        error: 'Invalid page or limit'
      });
    }

    const where = {};

    if (req.query.genre) {
      where.genre = String(req.query.genre).toLowerCase().trim();
    }

    const allowedSortFields = [
      'title',
      'genre',
      'published_year',
      'id'
    ];

    const sortField = req.query.sort || 'id';

    if (!allowedSortFields.includes(sortField)) {
      return res.status(400).json({
        error: 'Invalid sort field'
      });
    }

    const sortDirection =
      String(req.query.order || 'asc').toLowerCase() === 'desc'
        ? 'DESC'
        : 'ASC';

    const result = await Book.findAndCountAll({
      where,
      include: [{
        model: Author,
        attributes: ['name']
      }],
      order: [
        [sortField, sortDirection],
        ['id', 'ASC']
      ],
      limit,
      offset: (page - 1) * limit
    });

    return res.json({
      page,
      limit,
      total: result.count,
      data: result.rows
    });
  } catch (error) {
    return sendError(res, error, 'books');
  }
});

// POST /books
app.post('/books', async (req, res) => {
  try {
    const {
      title,
      genre,
      published_year,
      author_id
    } = bookSchema.parse(req.body);

    if (author_id != null) {
      const author = await Author.findByPk(author_id);

      if (!author) {
        return res.status(400).json({
          error: 'Author does not exist'
        });
      }
    }

    const book = await Book.create({
      title,
      genre,
      published_year,
      author_id
    });

    return res.status(201).json(book);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: 'Invalid book data',
        details: error.issues
      });
    }

    reportError(error, 'books');

    return res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// GET /books/:id
app.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id, {
      include: [{
        model: Author,
        attributes: ['name']
      }]
    });

    if (!book) {
      return res.status(404).json({
        error: 'Book not found'
      });
    }

    return res.json(book);
  } catch (error) {
    return sendError(res, error, 'books');
  }
});

// PUT /books/:id
app.put('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);

    if (!book) {
      return res.status(404).json({
        error: 'Book not found'
      });
    }

    const allowedFields = [
      'title',
      'genre',
      'published_year',
      'author_id'
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        book[field] = req.body[field];
      }
    }

    await book.save();

    return res.json(book);
  } catch (error) {
    return sendError(res, error, 'books');
  }
});

// DELETE /books/:id
app.delete('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);

    if (!book) {
      return res.status(404).json({
        error: 'Book not found'
      });
    }

    await book.destroy();

    return res.json({
      message: 'Book deleted successfully',
      book
    });
  } catch (error) {
    return sendError(res, error, 'books');
  }
});

// POST /authors
app.post('/authors', async (req, res) => {
  try {
    const author = await Author.create({
      name: req.body.name
    });

    return res.status(201).json(author);
  } catch (error) {
    return sendError(res, error, 'authors');
  }
});

// GET /authors
app.get('/authors', async (req, res) => {
  try {
    const authors = await Author.findAll({
      order: [['name', 'ASC']]
    });

    return res.json(authors);
  } catch (error) {
    return sendError(res, error, 'authors');
  }
});

// GET /authors/:id/books
app.get('/authors/:id/books', async (req, res) => {
  try {
    const author = await Author.findByPk(req.params.id, {
      include: [{
        model: Book
      }]
    });

    if (!author) {
      return res.status(404).json({
        error: 'Author not found'
      });
    }

    return res.json(author);
  } catch (error) {
    return sendError(res, error, 'authors');
  }
});

// POST /members
app.post('/members', async (req, res) => {
  try {
    const member = await Member.create({
      name: req.body.name,
      email: req.body.email
    });

    return res.status(201).json(member);
  } catch (error) {
    return sendError(res, error, 'members');
  }
});

// GET /members
app.get('/members', async (req, res) => {
  try {
    const members = await Member.findAll({
      order: [['name', 'ASC']]
    });

    return res.json(members);
  } catch (error) {
    return sendError(res, error, 'members');
  }
});

// POST /loans
app.post('/loans', async (req, res) => {
  try {
    const { book_id, member_id } = req.body;

    const [book, member] = await Promise.all([
      Book.findByPk(book_id),
      Member.findByPk(member_id)
    ]);

    if (!book) {
      return res.status(400).json({
        error: 'Book does not exist'
      });
    }

    if (!member) {
      return res.status(400).json({
        error: 'Member does not exist'
      });
    }

    const activeLoan = await Loan.findOne({
      where: {
        book_id,
        returned_at: null
      }
    });

    if (activeLoan) {
      return res.status(409).json({
        error: 'This book is already on loan'
      });
    }

    const loan = await Loan.create({
      book_id,
      member_id,
      loan_date: new Date().toISOString().slice(0, 10),
      returned_at: null
    });

    return res.status(201).json(loan);
  } catch (error) {
    return sendError(res, error, 'loans');
  }
});

// GET /members/:id/loans
app.get('/members/:id/loans', async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id, {
      include: [{
        model: Book,
        through: {
          attributes: ['id', 'loan_date', 'returned_at']
        }
      }]
    });

    if (!member) {
      return res.status(404).json({
        error: 'Member not found'
      });
    }

    return res.json(member);
  } catch (error) {
    return sendError(res, error, 'loans');
  }
});

// GET /loans/active
app.get('/loans/active', async (req, res) => {
  try {
    const loans = await Loan.findAll({
      where: {
        returned_at: null
      },
      include: [
        { model: Book },
        { model: Member }
      ]
    });

    return res.json(loans);
  } catch (error) {
    return sendError(res, error, 'loans');
  }
});

// Unknown routes
app.use((req, res) => {
  return res.status(404).json({
    error: 'Route not found'
  });
});

// Sentry error handler
Sentry.setupExpressErrorHandler(app);

// Invalid JSON handler
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && 'body' in error) {
    return res.status(400).json({
      error: 'Invalid JSON body'
    });
  }

  return res.status(500).json({
    error: 'Internal server error'
  });
});

export { app };

async function startServer() {
  try {
    await sequelize.authenticate();

    console.log('Database connection established successfully');

    app.listen(PORT, () => {
      console.log(`Library API listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exitCode = 1;
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  await startServer();
}

function unusedFunction() {
  const unusedVariable = 123;
  return unusedVariable;
}

export function qualityGateDemo(value) {
    if (value > 10) {
        return "high";
    } else if (value > 5) {
        return "medium";
    } else {
        return "low";
    }
}