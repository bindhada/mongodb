
# Week 10 – Sequelize Answers

## Skill 1: Understand the ORM

### 1. What does Sequelize translate?

Sequelize translates JavaScript code into SQL queries. For example, when I use Book.findAll(), Sequelize generates a SQL SELECT query to retrieve books from my PostgreSQL database. This means I can work with JavaScript models instead of writing every SQL query manually.

### 2. What does ORM stand for?

ORM stands for Object-Relational Mapping. The object part refers to JavaScript objects and classes that represent data. The relational part refers to relational database tables, rows and relationships. An ORM connects these two worlds so I can interact with database tables using JavaScript.

### 3. What SQL does Book.findAll() and Book.findByPk(3) run?

Book.findAll() generates:

```sql
SELECT * FROM books;
```

Book.findByPk(3) generates:

```sql
SELECT * FROM books WHERE id = 3;
```

### 4. What do host, port, dialect and logging do?

- host specifies the address of the database server.
- port specifies the port used to connect to the database.
- dialect tells Sequelize which database system to use, such as PostgreSQL.
- logging controls whether Sequelize prints generated SQL queries in the terminal.

### 5. What does sequelize.sync() do?

sequelize.sync() checks the models and creates database tables that do not already exist.

sequelize.sync({ force: true }) drops existing tables and recreates them. This can permanently delete existing data, so it should never be used on a database containing important real data.

### 6. When is plain SQL better than an ORM?

Plain SQL is better when I need complex queries involving multiple JOINs, subqueries or advanced database operations. It also gives me more control over the exact SQL being executed.

## Skill 4: Many-to-many relationships

### Why does the loan date belong in the loans table and not in books or members?

The loan date belongs in the loans table because it describes the relationship between a particular member and a particular book.

A member can borrow many books, and a book can be borrowed by many different members over time. Each borrowing event can have a different loan date and return date.

If the date were stored in the books or members table, it would be difficult to keep track of multiple borrowing events. The loans table solves this problem by storing each borrowing event separately.

Week 11 – Catching Bugs in Production with Sentry
Exercise 1: Install the alarm system

Question: Why must instrument.js be imported before everything else?

Sentry must be initialized before Express and other application modules are loaded so it can monitor the application and capture errors correctly.

Question: Why do we keep the DSN in .env instead of in the code?

We keep the DSN in the .env file to separate configuration from source code. This makes it easier to manage different environments and prevents accidentally exposing configuration in the repository.

Exercise 2: Your first error report

Question: You didn't add any extra information to this error yourself. List everything Sentry recorded anyway.

Sentry automatically recorded the error message, exception type, stack trace, file name, line number, timestamp, Node.js version, operating system, environment, and available request information.