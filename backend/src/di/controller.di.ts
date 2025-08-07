import { userController } from "@/controller/user.controller";
import { UserServices } from "./service.di";

export const UserController =new userController(UserServices)