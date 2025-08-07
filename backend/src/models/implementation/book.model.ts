import { IBook } from "shared/types/Book.interface";
import { Document, model, Schema } from "mongoose";
export interface IbookDocument extends IBook, Document {}
const bookSchema = new Schema<IbookDocument>({
  title: { type: String, required: true },
  author: { type: String, required: true },
  ISBN: { type: String, required: true, unique: true },
  publicationDate: { type: Date },
  genre: { type: String },
  copies: { type: Number, default: 1 },
  listed: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export const BookModel = model("Book", bookSchema);
