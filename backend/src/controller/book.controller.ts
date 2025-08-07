import { HttpResponse, HttpStatus } from "@/constants";
import { bookDto } from "@/dto/book.dto";
import { IBorrowServices } from "@/services/interface/borrow.service";
import { IbookService } from "@/services/interface/Ibook.service";
import { UserRequest } from "@/utils/httpInterface.utill";
import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { IBook } from "shared/types/Book.interface";

export class bookController {
  constructor(
    private bookService: IbookService,
    private borrowService: IBorrowServices
  ) {}
  async createBook(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      data.image = req.file?.path.replace(/^public[\\/]/, "");

      const book = await this.bookService.createBook(data);
      res
        .status(HttpStatus.CREATED)
        .json({ message: HttpResponse.BOOK_CREATION_SUCCESS, data: book });
      return;
    } catch (error) {
      next(error);
    }
  }
  async updateBook(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body as IBook;
      if (req.file) {
        if (req.file.path) {
          console.log("yess");

          data.image = req.file.path.replace(/^public[\\/]/, "");
        }
      }
      const ISBN = req.params.ISBN;
      console.log(data, "datasssssss");

      const datas = await this.bookService.updateBook(ISBN, data);
      res.status(HttpStatus.OK).json({
        success: true,
        message: HttpResponse.BOOK_UPDATED,
        data: new bookDto(data, true),
      });
      return;
    } catch (error) {
      next(error);
    }
  }
  async getAllbooks(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, search, sortOrder, genre } = req.query;
      const datas = await this.bookService.getAllBooks(
        (req as UserRequest).user.role == "admin" ? true : false,
        Number(page),
        Number(limit),
        String(search),
        String(sortOrder),
        { genre: String(genre) }
      );
      res
        .status(HttpStatus.OK)
        .json({ success: true, data: datas.data, total: datas.totalpage });
    } catch (error) {
      next(error);
    }
  }
  async getSelected(req: Request, res: Response, next: NextFunction) {
    try {
      const ISBN = req.params.ISBN;
      const data = await this.bookService.getSelectedBook(
        ISBN,
        (req as UserRequest).user.id
      );

      res.status(HttpStatus.OK).json({ success: true, data });
      return;
    } catch (error) {
      next(error);
    }
  }
  async Mostactiveusers(req: Request, res: Response, next: NextFunction) {
    const data = await this.borrowService.Mostactiveusers();
    res
      .status(HttpStatus.OK)
      .json({ success: true, message: "successfully fetch the data", data });
    return;
  }
  async monstBorrowdBook(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("heree");

      const data = await this.borrowService.monstBorrowdBook();
      res
        .status(HttpStatus.OK)
        .json({ success: true, message: "successfully fetch the data", data });
      return;
    } catch (error) {
      next(error);
    }
  }
}
