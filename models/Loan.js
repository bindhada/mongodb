
import mongoose from "mongoose";

const loanSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: [true, "Book is required"],
    },
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: [true, "Member is required"],
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
  { timestamps: true }
);

const Loan = mongoose.model("Loan", loanSchema);

export default Loan;
