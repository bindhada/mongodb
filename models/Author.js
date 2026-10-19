
import mongoose from "mongoose";

const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
      minlength: [2, "Author name must be at least 2 characters"],
      maxlength: [100, "Author name cannot exceed 100 characters"],
    },
  },
  { timestamps: true }
);

const Author = mongoose.model("Author", authorSchema);

export default Author;
