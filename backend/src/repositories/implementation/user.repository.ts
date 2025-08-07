import { IUser } from "shared/types";
import { IUserRepository } from "../interface/Iuser.repository";
import { IUserDocument, userModel } from "@/models/implementation/user.model";
import { BaseRepository } from "../basic.repository";
import { Document, Types } from "mongoose";

export class userRepository
  extends BaseRepository<IUserDocument>
  implements IUserRepository
{
  constructor() {
    super(userModel);
  }
  async findByUserId(id: Types.ObjectId): Promise<IUserDocument | null> {
    return await this.findById(id);
  }
  async updatePassword(
    userid: string,
    hashedPassword: string
  ): Promise<IUserDocument | null> {
    return await this.findOneAndUpdate(
      { _id: userid },
      { password: hashedPassword }
    );
  }
}
