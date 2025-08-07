import { IUser } from './user.interface';
import { IBook } from './Book.interface';
import { Types } from "mongoose";



export interface IBorrowRecord {
  user: Types.ObjectId;
  book: Types.ObjectId;
  borrowedAt: Date;
  returnedAt?: Date;
  status: "borrowed" | "returned";
}

// for Populated
export interface IBorrowRecordPopulated {
  user: IUser;
  book: IBook;
  borrowedAt: Date;
  returnedAt?: Date;
  status: "borrowed" | "returned";
}

export interface ImostBorrowedBookd{
  title:string;
  auther:string;
  borrowdCount:number
}
