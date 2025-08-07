import { bookDto } from "@/dto/book.dto";
import { IbookRepository } from "@/repositories/interface/Ibook.repository";
import { Types } from "mongoose";
import { IBook } from "shared/types/Book.interface";

class bookServices {
  constructor(private BookRepository: IbookRepository) {}
  createBook(book: IBook) {
    this.BookRepository.create(book);
  }
  async updateBook(ISBN: string, update: Partial<IBook>) {
    const updateData: Partial<IBook> = {};

    const allowedFields: (keyof IBook)[] = [
      "title",
      "author",
      "ISBN",
      "publicationDate",
      "genre",
      "copies",
      "listed",
    ];

    for (const key of allowedFields) {
      if (key in update) {
        updateData[key] = update[key] as any
      }
    }

    const updatedBook = await this.BookRepository.findOneAndUpdate(
      { ISBN },
      { $set: updateData },
    
    );

    return updatedBook;
  }
}
