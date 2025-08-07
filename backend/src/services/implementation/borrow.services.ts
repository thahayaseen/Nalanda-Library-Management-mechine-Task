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
import { IBorrowServices } from "../interface/borrow.service";

export class borrowServices implements IBorrowServices {
  constructor(
    private borrowRepository: IborrowRepository,
    private bookRepository: IbookRepository
  ) {}
  async borrowAbook(userid: Types.ObjectId, ISBN: string) {
    console.log(userid, ISBN, "hefasdrer");

    const book = await this.bookRepository.findOne({ ISBN: ISBN });
    if (!book) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.BOOK_NOT_FOUND);
    }
    if (book.copies <= 0) {
      throw createHttpError(
        HttpStatus.FORBIDDEN,
        HttpResponse.BOOK_COPY_OUTOFSTOCK
      );
    }

    await this.borrowRepository.create({
      user: userid,
      book: book._id as Types.ObjectId,
    });
    book.copies = book.copies - 1;
    await book.save();
    return;
  }

  async returnBook(borrowid: Types.ObjectId, userid: Types.ObjectId) {
    const borrow = await this.borrowRepository.findOne({
      _id: borrowid,
      user: userid,
    });

    if (!borrow) {
      throw createHttpError(
        HttpStatus.NOT_FOUND,
        HttpResponse.BORROW_NOT_FOUND
      );
    }
    const book = await this.bookRepository.findById(borrow.book);

    if (borrow.status == "returned") {
      throw createHttpError(
        HttpStatus.CONFLICT,
        HttpResponse.BOOK_ALDREDY_RETURNED
      );
    }
    if (book) {
      book.copies = book.copies + 1;
      await book.save();
    }
    borrow.returnedAt = new Date(Date.now());
    borrow.status = "returned";
    await borrow.save();
    return;
  }
  async getMyBorrowedBooks(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: borrowDto[]; total: number }> {
    console.log(userId,'id');
    
    const borrowedRecords =
      await this.borrowRepository.find<IBorrowRecordPopulated>(
        { user: userId },
        page,
        limit,
        ["user", "book"]
      );
    if (borrowedRecords.data.length == 0) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.BOOK_NOT_FOUND);
    }
    const results = borrowedRecords.data.map(
      (record) => new borrowDto(record as IBorrowRecordPopulated)
    );

    return { data: results, total: borrowedRecords.pages };
  }
  async Mostactiveusers(): Promise<ImostActiveUser[]> {
    return await this.borrowRepository.mostActiveuser();
  }
  async monstBorrowdBook(): Promise<ImostBorrowedBookd[]> {
    return await this.borrowRepository.monstBorrowdBook();
  }
}
