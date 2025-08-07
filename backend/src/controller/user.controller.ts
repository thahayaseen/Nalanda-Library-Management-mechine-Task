import { IuserServices } from "@/services/interface/Iuser.service";

import { NextFunction, Request, Response } from "express";
import { UserRequest } from "@/utils/httpInterface.utill";
import { Types } from "mongoose";
import { HttpResponse, HttpStatus } from "@/constants";
import { IBorrowServices } from "@/services/interface/borrow.service";
import { createHttpError } from "@/utils/httpError.utill";
import { BorrowService } from "@/di/service.di";
export class userController {
  constructor(
    private UserServices: IuserServices,
    private borrowService: IBorrowServices
  ) {}
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userid = (req as UserRequest).user.id;

      const data = await this.UserServices.getProfile(
        new Types.ObjectId(String(userid))
      );
      res.status(HttpStatus.OK).json({
        success: true,
        message: "data fetch success",
        data,
      });
    } catch (error) {
      next(error);
    }
  }
  async buyAbook(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("herere");

      const userid = (req as UserRequest).user.id;
      const ISBN = req.params.id;
      console.log(userid, "ajfsdf");

      await this.borrowService.borrowAbook(new Types.ObjectId(userid), ISBN);
      res
        .status(HttpStatus.CREATED)
        .json({ success: true, message: "Successfully Borrowed the book" });
      return;
    } catch (error) {}
  }
  async returnBook(req: Request, res: Response, next: NextFunction) {
    try {
      const { bookId } = req.body;
      if (!bookId) {
        throw createHttpError(
          HttpStatus.FORBIDDEN,
          HttpResponse.INVALID_CREDENTIALS
        );
      }
      const userid = (req as UserRequest).user.id;
      await this.borrowService.returnBook(bookId, new Types.ObjectId(userid));
      res
        .status(HttpStatus.OK)
        .json({ success: true, message: "succesfully returned" });
    } catch (error) {
      next(error);
    }
  }
  async BorrowdRecords(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = req.query;
      console.log(page,'pages');
      
      const record = await this.borrowService.getMyBorrowedBooks(
        (req as UserRequest).user.id,
        Number(page||1),
        Number(limit||5)
      );
      res.status(HttpStatus.OK).json({
        success: true,
        message: "succesfully fetch data",
        data: record.data,
        totalPages: record.total,
      });
    } catch (error) {
      next(error);
    }
  }
}
