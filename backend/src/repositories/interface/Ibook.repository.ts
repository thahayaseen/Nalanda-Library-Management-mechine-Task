import { Types } from "mongoose";

export interface IbookRepository {
    borrowBook(id:Types.ObjectId):Promise<void>
}