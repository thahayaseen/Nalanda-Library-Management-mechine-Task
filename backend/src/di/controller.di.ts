import { userController } from "@/controller/user.controller";
import { BorrowService, UserServices } from "./service.di";

export const UserController = new userController(UserServices, BorrowService);
