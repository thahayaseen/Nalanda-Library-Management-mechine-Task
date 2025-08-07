import { HttpResponse, HttpStatus } from "@/constants";
import { IBorrowServices } from "@/services/interface/borrow.service";
import { IbookService } from "@/services/interface/Ibook.service";
import { UserRequest } from "@/utils/httpInterface.utill";
import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { IBook } from "shared/types/Book.interface";

class bookController {
  constructor(
    private bookService: IbookService,
    private borrowService: IBorrowServices
  ) {}
  async createBook(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
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

      const updaed = await this.bookService.updateBook(data.ISBN, data);
      res.status(HttpStatus.OK).json({
        success: true,
        message: HttpResponse.BOOK_UPDATED,
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
    const ISBN = req.params.id;
    const data = await this.bookService.getSelectedBook(ISBN);
    res.status(HttpStatus.OK).json({ success: true, data });
    return;
  }
  
}
