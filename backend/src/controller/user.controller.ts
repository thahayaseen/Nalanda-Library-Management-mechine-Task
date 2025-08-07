import { IuserServices } from "@/services/interface/Iuser.service";
import { UserServices } from "./../di/service.di";
import { NextFunction, Request, Response } from "express";
import { UserRequest } from "@/utils/httpInterface.utill";
import { Types } from "mongoose";
import { HttpStatus } from "@/constants";
export class userController {
  constructor(private UserServices: IuserServices) {}
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userid = (req as UserRequest).user.id;

      const data = await this.UserServices.getProfile(
        new Types.ObjectId(String(userid))
      );
       res.status(HttpStatus.OK).json({
        success: true,
        message: "data fetch success",
        data
      });
    } catch (error) {
      next(error);
    }
  }
}
