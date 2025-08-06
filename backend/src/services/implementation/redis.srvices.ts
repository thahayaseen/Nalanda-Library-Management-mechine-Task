import { env } from "@/config";
import { IredisService } from "../interface/Iredis.services";
import { IUser } from "shared/types";
import { HttpResponse } from "@/constants";

export class redisService implements IredisService {
  private otpTime;
  private userTime;
  constructor(private RedisProvider: iRedisProvider) {
    this.otpTime = env.otpTimelimit;
    this.userTime = env.userTime;
  }
  async getOtp(userid: string): Promise<string | null> {
    console.log(this.Keygenerate("otp", userid));
    
    return await this.RedisProvider.getData(this.Keygenerate("otp", userid));
  }
  async getUserData(userid: string): Promise<IUser> {
    const data = await this.RedisProvider.getData(
      this.Keygenerate("user", userid)
    );
    if (!data) {
      throw new Error(HttpResponse.USER_NOT_FOUND);
    }
    return JSON.parse(data) as IUser;
  }

  private Keygenerate(to: string, key: string): string {
    return `${to}-${key}`;
  }
  async saveOtp(userid: string, value: number): Promise<void> {
    await this.RedisProvider.storeData(
      this.Keygenerate("otp", userid),
      String(value),
      this.otpTime
    );
    return;
  }
  async saveUserdata(userdata: IUser): Promise<string> {
    return await this.RedisProvider.storeData(
      this.Keygenerate("user", userdata._id as string),
      JSON.stringify(userdata),
      this.userTime
    );
  }
}
