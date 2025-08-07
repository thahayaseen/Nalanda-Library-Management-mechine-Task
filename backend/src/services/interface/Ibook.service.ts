import { bookDto } from "@/dto/book.dto";
import { IbookDocument } from "@/models/implementation/book.model";
import { IBook } from "shared/types/Book.interface";

export interface IbookService {
  createBook(book: IBook): Promise<IbookDocument>;
  updateBook(ISBN: string, update: Partial<IBook>): Promise<IbookDocument>;
  getAllBooks(
    isAdmin: boolean,
    page: number,
    limit: number,
    search: string,

    sortOrder: string,
    filters: Partial<{ genre: string; author: string }>
  ): Promise<{ data: bookDto[]; totalpage: number }>;
  getSelectedBook(
    ISBN: string,
    userid: string
  ): Promise<{
    data: bookDto;
    aldredy: {
      ispurchased: boolean;
      id: string;
    };
  }>;
}
