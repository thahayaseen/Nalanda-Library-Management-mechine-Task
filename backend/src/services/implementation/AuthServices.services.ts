import { IUser } from "shared/types";
import { IAuthServices } from "../interface/Iauth.service";
import { userRepository } from "@/repositories/implementation/user.repository";
import { comparePassword, hashPassword } from "@/utils/bcrypt.utill";
import { createHttpError } from "@/utils/httpError.utill";
import { HttpResponse, HttpStatus } from "@/constants";
import { generateAccessToken, generateRefreshToken } from "@/utils/jwt.util";
import Otp from "@/provider/implemendation/otp.provider";
import { IredisService } from "../interface/Iredis.service";
import { v4 as uuid } from "uuid";
import { Inodemailservices } from "../interface/Inodemail.service";
export interface sighUserreturn {
  accessToken: string;
  refreshToken: string;
  user: {
    _id: string;
    username: string;
    email: string;
    createdAt: string;
  };
}
export class authServices implements IAuthServices {
  private userRepository;
  constructor(
    private redisService: IredisService,
    private nodemailService: Inodemailservices
  ) {
    this.userRepository = new userRepository();
  }
  async createUser(data: IUser): Promise<string> {
    const userAldredy = await this.userRepository.findByUsernameOrEmail(
      data.email
    );
    if (userAldredy) {
      throw createHttpError(HttpStatus.CONFLICT, HttpResponse.USER_EXIST);
    }
    data.isVerified = true;

    data.password = await hashPassword(data.password);
    await this.userRepository.create(data);
    // // data._id = uuid();
    // // await this.redisService.saveUserdata(data);
    // // await this.Otpsend(data._id, data);
    // console.log(data,'datais');

    return data.email;
  }
  async sigInUser(email: string, password: string): Promise<sighUserreturn> {
    const data = await this.userRepository.findByUsernameOrEmail(email);
    if (!data) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);
    }
    const compare = await comparePassword(password, data.password);
    console.log(compare);
    if (!compare) {
      throw createHttpError(
        HttpStatus.BAD_REQUEST,
        HttpResponse.PASSWORD_INCORRECT
      );
    }
    const accessToken = generateAccessToken({
      email: data.email,
      id: data._id,
      role:data.role
    });
    const refreshToken = generateRefreshToken({
      email: data.email,
      id: data._id,
    });
    const user={
      _id:String(data._id),
      username:data.username,
      email:data.email,
      role:data.role,
      createdAt:String(data.createdAt)
    }
    return { accessToken, refreshToken, user};
  }
  async Otpsend(userid: string, data: IUser): Promise<string> {
    const otp = new Otp().getOtp;
    console.log(otp);
    const dataa = await this.redisService.saveOtp(userid, otp);
    await this.nodemailService.sendOtp(String(otp), data.email, data.username);
    console.log(data);

    return "";
  }
  async otpVarify(userotp: string, userid: string): Promise<void> {
    console.log(userid, "usdf");

    const otp = await this.redisService.getOtp(userid);
    if (!otp) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.OTP_NOT_FOUND);
    }
    if (userotp != otp) {
      throw createHttpError(HttpStatus.CONFLICT, HttpResponse.OTP_INCORRECT);
    }
    const userdata = await this.redisService.getUserData(userid);
    if (userdata && userdata._id) {
      delete userdata._id;
    }
    userdata.isVerified = true;
    await this.userRepository.create(userdata);
    return;
  }
}
