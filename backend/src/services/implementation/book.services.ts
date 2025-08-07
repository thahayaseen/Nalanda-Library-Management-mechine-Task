import { bookDto } from "@/dto/book.dto";
import { IbookDocument } from "@/models/implementation/book.model";
import { IbookRepository } from "@/repositories/interface/Ibook.repository";
import { Types } from "mongoose";
import { IBook } from "shared/types/Book.interface";
import { IbookService } from "../interface/Ibook.service";

export class bookServices implements IbookService{
  constructor(private BookRepository: IbookRepository) {}
  async createBook(book: IBook): Promise<IbookDocument> {
    return await this.BookRepository.create(book);
  }
  async updateBook(
    ISBN: string,
    update: Partial<IBook>
  ): Promise<IbookDocument> {
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
        updateData[key] = update[key] as any;
      }
    }

    const updatedBook = await this.BookRepository.findOneAndUpdate(
      { ISBN },
      { $set: updateData }
    );

    return updatedBook;
  }
  async getAllBooks(
    isAdmin: boolean = false,
    page: number = 1,
    limit: number = 10,
    search: string = "",

    sortOrder: string = "desc",
    filters: Partial<{ genre: string; author: string }> = {}
  ): Promise<{ data: bookDto[]; totalpage: number }>{
    const query: any = {
      listed: isAdmin,
      ...filters,
    };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },

      ];
    }

    const sortOption = sortOrder === "asc" ? true : false;

    const books = (await this.BookRepository.find(
      query,
      page,
      limit,
      [],
      sortOption
    )) 
const data=books.data.map((data) => new bookDto(data))
    return {data,totalpage:books.pages}
  }

  async getSelectedBook(ISBN: string): Promise<bookDto> {
    const books = (await this.BookRepository.findOne({
      ISBN,
      listed: true,
    })) as IBook;
    return new bookDto(books);
  }
}
