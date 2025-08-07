import { userProfileDto } from "@/dto/userprofile.dto";
import { Types } from "mongoose";
import { IUser } from "shared/types";

export interface IuserServices{
   getProfile(userid: Types.ObjectId):Promise<userProfileDto>
}