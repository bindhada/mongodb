PostgreSQL vs MongoDB: Library API Comparison
1. Schema and Validation

In my PostgreSQL library project, the database used tables with defined columns and data types. Constraints such as NOT NULL, CHECK, and UNIQUE helped prevent invalid data from being stored. In my MongoDB project, I used Mongoose schemas to define book fields such as title, genre, and publishedYear. Mongoose validation allows me to require a title, restrict genres to an allowed list, and set a valid publication-year range. I also added timestamps to record when books were created and updated.

I found Mongoose validation convenient because the rules are written in JavaScript alongside the model. PostgreSQL provides stronger database-level constraints, while MongoDB with Mongoose offers flexibility in how document structures evolve.

2. Relationships: JOIN vs populate()

In PostgreSQL, books and authors can be connected using foreign keys. A JOIN retrieves information from related tables, and foreign keys help ensure that referenced records exist. In MongoDB, I stored an author's ObjectId in each book and used Mongoose's populate() method to retrieve the author's details.

The populate() approach is convenient when working with JavaScript objects, but MongoDB references do not automatically enforce foreign-key constraints. The API must check that referenced authors, books, and members exist before saving relationships.

3. Adding a New Field

Adding a field to a PostgreSQL table generally requires an ALTER TABLE statement or a database migration. Existing rows must be considered when adding required fields or defaults. In MongoDB, a new field can be added to documents without modifying every existing document. However, I still need to update the Mongoose schema and application code if I want the new field to be validated and used consistently.

MongoDB makes changes to document structure flexible, but flexibility does not eliminate the need for validation and careful data management.

4. Embedding vs Referencing

I used references for loans by storing book and member ObjectIds in separate loan documents. This makes it easier to retrieve borrowing histories, query loans across all members, and calculate statistics. An alternative is embedding recent loans inside each member document. Embedding makes it convenient to retrieve a member and their recent borrowing history together, but querying all loans across every member becomes more complicated.

I would use embedding for small, bounded collections of data that are usually accessed together. I would use references for growing loan histories and records that need to be queried independently.

5. Final Verdict

For a library management system, I would choose PostgreSQL because books, authors, members, and loans have clear relationships, and data integrity is important when borrowing and returning books. Foreign keys and transactions help protect consistency. MongoDB is also a good option when flexible document structures are useful and related data is commonly accessed together. This project helped me understand that the best database depends on the application's relationships, validation requirements, and query patterns rather than one database always being better than the other.