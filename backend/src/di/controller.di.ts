import { userController } from "@/controller/user.controller";
import {  bookController } from "@/controller/book.controller";
import { BookServices, BorrowService, UserServices } from "./service.di";

export const UserController = new userController(UserServices, BorrowService);
export const BookController =new bookController(BookServices,BorrowService)