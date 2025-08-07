import { Ibook } from 'shared/types/book.interface';
import { Document, model, Schema } from "mongoose";
interface IbookDocument extends Ibook,Document{}
const bookSchema = new Schema<IbookDocument>({
  title: { type: String, required: true },
  author: { type: String, required: true },
  ISBN: { type: String, required: true, unique: true },
  publicationDate: { type: Date },
  genre: { type: String },
  copies: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
});

export const Book = model('Book', bookSchema);
