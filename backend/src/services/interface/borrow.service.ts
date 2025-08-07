import { Types } from "mongoose";
import { borrowDto } from "@/dto/borrow.dto";
import { IBorrowRecordPopulated, ImostBorrowedBookd } from "shared/types/Borrowrecord.interface";
import { ImostActiveUser } from "shared/types/user.interface";

export interface IBorrowServices {
  borrowAbook(userid: Types.ObjectId, ISBN: string): Promise<void>;
  returnBook(borrowid: Types.ObjectId, userid: Types.ObjectId): Promise<void>;
  getMyBorrowedBooks(
    userId: string,
    page?: number,
    limit?: number
  ): Promise<{ data: borrowDto[]; total: number }>;
  Mostactiveusers(): Promise<ImostActiveUser[]>;
  monstBorrowdBook(): Promise<ImostBorrowedBookd[]>;
}
