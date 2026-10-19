
import mongoose from "mongoose";

const embeddedLoanSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    borrowedAt: {
      type: Date,
      default: Date.now,
    },
    returnedAt: {
      type: Date,
      default: null,
    },
  },
  { _id: true }
);

const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Member name is required"],
      trim: true,
      minlength: [2, "Member name must be at least 2 characters"],
      maxlength: [100, "Member name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Member email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },
    recentLoans: {
      type: [embeddedLoanSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const Member = mongoose.model("Member", memberSchema);

export default Member;
