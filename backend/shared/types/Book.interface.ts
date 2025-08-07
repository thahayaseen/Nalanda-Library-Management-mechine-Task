import { Types } from "mongoose";

export interface IBook{
    _id?:string|Types.ObjectId;
    title:string;
    author:string;
    ISBN:string;
    publicationDate:Date;
    genre:string;
    copies:number;
    createdAt?:Date;
    listed:boolean;
    image:string
}