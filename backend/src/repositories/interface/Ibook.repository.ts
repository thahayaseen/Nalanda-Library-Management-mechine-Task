import { Types } from "mongoose";
import { BaseRepository } from "../basic.repository";
import { IbookDocument } from "@/models/implementation/book.model";

export interface IbookRepository extends BaseRepository<IbookDocument>{
    borrowBook(id:Types.ObjectId):Promise<void>
}