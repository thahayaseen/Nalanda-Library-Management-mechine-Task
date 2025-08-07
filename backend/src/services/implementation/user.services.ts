import { userProfileDto } from "@/dto/userprofile.dto";
import { IuserServices } from "../interface/Iuser.service";
import { IUserRepository } from "@/repositories/interface/Iuser.repository";
import { Types } from "mongoose";
import { createHttpError } from "@/utils/httpError.utill";
import { HttpResponse, HttpStatus } from "@/constants";
import { IUser } from "shared/types";

export class userServices implements IuserServices {
  constructor(private userRepository: IUserRepository) {}
  async getProfile(userid: Types.ObjectId): Promise<userProfileDto> {
    const user = (await this.userRepository.findById(userid)) as IUser;
    if (!user) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);
    }
    return new userProfileDto(user);
  }
  
}
