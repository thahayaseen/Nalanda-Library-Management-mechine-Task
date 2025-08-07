
import { HttpResponse, HttpStatus } from "@/constants";
import { borrowDto } from "@/dto/borrow.dto";
import { IBorrowdDocument } from "@/models/implementation/borrowd.model";
import { IbookRepository } from "@/repositories/interface/Ibook.repository";
import { IborrowRepository } from "@/repositories/interface/Iborrow.repository";
import { createHttpError } from "@/utils/httpError.utill";
import { Types } from "mongoose";
import {
  IBorrowRecordPopulated,
  ImostBorrowedBookd,
} from "shared/types/Borrowrecord.interface";
import { ImostActiveUser } from "shared/types/user.interface";

class borrowServices {
  constructor(private borrowRepository: IborrowRepository,private bookRepository:IbookRepository) {}
  async borrowAbook(userid: Types.ObjectId, ISBN: string) {
    const book=await this.bookRepository.findOne({ISBN:ISBN})
    if(!book){
        throw createHttpError(HttpStatus.NOT_FOUND,HttpResponse.BOOK_NOT_FOUND)
    }
    if(book.copies<=0){
        throw createHttpError(HttpStatus.FORBIDDEN,HttpResponse.BOOK_COPY_OUTOFSTOCK)
    }
    await this.borrowRepository.create({ user: userid, book: book._id as Types.ObjectId });
    return;
  }

  async returnBook(borrowid: Types.ObjectId, userid: Types.ObjectId) {
    const book = await this.borrowRepository.findOne({
      _id: borrowid,
      user: userid,
    });
    if (!book) {
      throw createHttpError(
        HttpStatus.NOT_FOUND,
        HttpResponse.BORROW_NOT_FOUND
      );
    }
    if (book.status=='returned') {
      throw createHttpError(
        HttpStatus.CONFLICT,
        HttpResponse.BOOK_ALDREDY_RETURNED
      );
    }
    book.returnedAt = new Date(Date.now());
    book.status = "returned";
    await book.save();
    return
  }
  async getMyBorrowedBooks(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<borrowDto[]> {
    const borrowedRecords =
      await this.borrowRepository.find<IBorrowRecordPopulated>(
        { user: userId },
        page,
        limit,
        ["user", "book"]
      );

    const results = borrowedRecords.map(
      (record) => new borrowDto(record as IBorrowRecordPopulated)
    );

    return results;
  }
  async Mostactiveusers(): Promise<ImostActiveUser[]> {
    return await this.borrowRepository.mostActiveuser();
  }
  async monstBorrowdBook(): Promise<ImostBorrowedBookd[]> {
    return await this.borrowRepository.monstBorrowdBook();
  }
}
