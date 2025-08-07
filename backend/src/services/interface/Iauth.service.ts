import { IUser } from "shared/types";
import { sighUserreturn } from "../implementation/AuthServices.services";

export interface IAuthServices {
  createUser(data: IUser): Promise<string>;
  sigInUser(email: string, password: string): Promise<sighUserreturn>;
  otpVarify(userotp:string,userid:string):Promise<void>
  //   verifyOtp(email: string, otp: string): Promise<string>;
}
