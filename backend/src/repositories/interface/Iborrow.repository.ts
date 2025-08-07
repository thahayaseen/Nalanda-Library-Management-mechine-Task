import { IBook } from "shared/types/Book.interface";
import { ImostBorrowedBookd } from "shared/types/Borrowrecord.interface";
import { ImostActiveUser } from "shared/types/user.interface";
import { BaseRepository } from "../basic.repository";
import { IBorrowdDocument } from "@/models/implementation/borrowd.model";

export interface IborrowRepository extends BaseRepository<IBorrowdDocument>{
    monstBorrowdBook():Promise<ImostBorrowedBookd[]>;
    mostActiveuser():Promise<ImostActiveUser[]>
}