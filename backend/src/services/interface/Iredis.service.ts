import { IUser } from "shared/types";

export interface IredisService {
  getOtp(userid: string): Promise<string | null>;
  getUserData(userid: string): Promise<IUser>;
  saveOtp(userid: string, value: number): Promise<void>;
  saveUserdata(userdata: IUser): Promise<string>;
}
