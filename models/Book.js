
import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Book title is required"],
      trim: true,
      minlength: [1, "Book title cannot be empty"],
      maxlength: [200, "Book title cannot exceed 200 characters"],
    },
    genre: {
      type: String,
      required: [true, "Book genre is required"],
      lowercase: true,
      trim: true,
      enum: {
        values: ["fantasy", "dystopian", "children", "classic"],
        message: "Genre must be fantasy, dystopian, children, or classic",
      },
    },
    publishedYear: {
      type: Number,
      required: [true, "Published year is required"],
      min: [0, "Published year cannot be negative"],
      max: [2100, "Published year cannot exceed 2100"],
      validate: {
        validator: Number.isInteger,
        message: "Published year must be a whole number",
      },
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
      default: null,
    },
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);

export default Book;
