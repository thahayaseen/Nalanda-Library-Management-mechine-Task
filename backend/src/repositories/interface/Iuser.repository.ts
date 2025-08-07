import { IUserDocument } from "@/models/implementation/user.model";
import { BaseRepository } from "../basic.repository";

export interface IUserRepository extends BaseRepository<IUserDocument>{
  updatePassword(
    userid: string,
    hashedPassword: string
  ): Promise<IUserDocument | null>;
}
