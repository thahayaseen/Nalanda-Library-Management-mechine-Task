import { IBorrowRecord } from "shared/types/Borrowrecord.interface";
import { model, Schema } from "mongoose";
interface IBorrowdDocument extends IBorrowRecord {}
const borrowRecordSchema = new Schema<IBorrowdDocument>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  book: { type: Schema.Types.ObjectId, ref: "Book", required: true },
  borrowedAt: { type: Date, default: Date.now },
  returnedAt: { type: Date },
  status: { type: String, enum: ["borrowed", "returned"], default: "borrowed" },
});

export const BorrowRecord = model("BorrowRecord", borrowRecordSchema);
