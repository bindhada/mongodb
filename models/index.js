
import Book from './book.js';
import Author from './author.js';
import Member from './member.js';
import Loan from './loan.js';

// One-to-many: Author → Books
Author.hasMany(Book, {
  foreignKey: 'author_id'
});

Book.belongsTo(Author, {
  foreignKey: 'author_id'
});

// Many-to-many: Members ↔ Books
Member.belongsToMany(Book, {
  through: Loan,
  foreignKey: 'member_id',
  otherKey: 'book_id'
});

Book.belongsToMany(Member, {
  through: Loan,
  foreignKey: 'book_id',
  otherKey: 'member_id'
});

// Direct loan relationships
Loan.belongsTo(Book, {
  foreignKey: 'book_id'
});

Loan.belongsTo(Member, {
  foreignKey: 'member_id'
});

export { Book, Author, Member, Loan };
