import { IuserServices } from "@/services/interface/Iuser.service";
import { UserServices } from "./../di/service.di";
import { NextFunction, Request, Response } from "express";
import { UserRequest } from "@/utils/httpInterface.utill";
import { Types } from "mongoose";
import { HttpStatus } from "@/constants";
import { IBorrowServices } from "@/services/interface/borrow.service";
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
      const userid = (req as UserRequest).user.id;
      const ISBN = req.body;
      await this.borrowService.borrowAbook(new Types.ObjectId(userid), ISBN);
      res
        .status(HttpStatus.CREATED)
        .json({ success: true, message: "Successfully Borrowed the book" });
      return;
    } catch (error) {}
  }
  async returnBook(req: Request, res: Response, next: NextFunction) {
    try {
      const { borrowid } = req.body;
      const userid = (req as UserRequest).user.id;
      await this.borrowService.returnBook(borrowid, new Types.ObjectId(userid));
    } catch (error) {
      next(error);
    }
  }
}
