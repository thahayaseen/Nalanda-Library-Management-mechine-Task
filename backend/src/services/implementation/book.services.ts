import { bookDto } from "@/dto/book.dto";
import { IbookDocument } from "@/models/implementation/book.model";
import { IbookRepository } from "@/repositories/interface/Ibook.repository";
import { Types } from "mongoose";
import { IBook } from "shared/types/Book.interface";
import { IbookService } from "../interface/Ibook.service";
import { createHttpError } from "@/utils/httpError.utill";
import { HttpResponse, HttpStatus } from "@/constants";
import { IborrowRepository } from "@/repositories/interface/Iborrow.repository";

export class bookServices implements IbookService {
  constructor(private BookRepository: IbookRepository,private BorrowRepository:IborrowRepository) {}
  async createBook(book: IBook): Promise<IbookDocument> {
    console.log(book,'data');
    
    return await this.BookRepository.create(book);
  }
  async updateBook(
    ISBN: string,
    update: Partial<IBook>={}
  ): Promise<IbookDocument> {
    const updateData: Partial<IBook> = {};
console.log(update);

    const allowedFields: (keyof IBook)[] = [
      "title",
      "author",
      "ISBN",
      "publicationDate",
      "genre",
      "copies",
      "listed",
      "image"
    ];

    for (const key of allowedFields) {
      if (key in update) {
        updateData[key] = update[key] as any;
      }
    }
console.log(updateData,'dathhyh');

    const updatedBook = await this.BookRepository.findOneAndUpdate(
      { ISBN },
      { $set: updateData }
    );
console.log(updatedBook,'after');

    return updatedBook;
  }
  async getAllBooks(
    isAdmin: boolean = false,
    page: number = 1,
    limit: number = 10,
    search: string = "",

    sortOrder: string = "desc",
    filters: Partial<{ genre: string; author: string }> = {}
  ): Promise<{ data: bookDto[]; totalpage: number }> {
    const query: any = { };
    if (!isAdmin) {
      query.listed = true;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
      ];
    }
    console.log(query);
    

    const sortOption = sortOrder === "asc" ? true : false;

    const books = await this.BookRepository.find(
      query,
      page,
      limit,
      [],
      sortOption
    );
    console.log(books,'the books');
    
    const data = books.data.map((data) => new bookDto(data,isAdmin));
    return { data, totalpage: books.pages };
  }

  async getSelectedBook(ISBN: string,userid:string): Promise<{data:bookDto,aldredy:{
    ispurchased:boolean,
    id:string
  }}> {
    console.log(ISBN,'simn');
    
    const books = (await this.BookRepository.findOne({
      ISBN,
      listed: true,
    })) as IBook;
    console.log(ISBN,userid,books,'datsfasda');
    
    const aldredu=await this.BorrowRepository.findOne({book:books._id,user:userid})
    console.log(aldredu);
    if(!books){
      throw createHttpError(HttpStatus.NOT_FOUND,HttpResponse.BOOK_NOT_FOUND)
    }
    return{data:new bookDto(books),aldredy:{ispurchased:aldredu?true:false,id:aldredu?._id as string}};
  }
}
