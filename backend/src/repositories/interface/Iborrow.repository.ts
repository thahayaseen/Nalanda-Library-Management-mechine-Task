import { IBook } from "shared/types/Book.interface";
import { ImostBorrowedBookd } from "shared/types/Borrowrecord.interface";
import { ImostActiveUser } from "shared/types/user.interface";

export interface IborrowRepository{
    monstBorrowdBook():Promise<ImostBorrowedBookd[]>;
    mostActiveuser():Promise<ImostActiveUser[]>
}