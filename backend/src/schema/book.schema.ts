import { z } from "zod";

export const BookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  ISBN: z.string().min(1, "ISBN is required"),
  publicationDate: z.coerce.date(), 
  genre: z.string().min(1, "Genre is required"),
  copies: z.number().int().nonnegative(), 
});

export type IBook = z.infer<typeof BookSchema>;
