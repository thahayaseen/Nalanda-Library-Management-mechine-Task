import dotenv from "dotenv";
dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`${key} is required in .env`);
  }
  return value;
}

export const env = {
  get PORT(): number {
    return Number(process.env.PORT) || 4000; 
  },
  get MONGO_URL(): string {
    return requireEnv("MONGO_URL");
  },
  get JWT_ACCESS_SECRET(): string {
    return requireEnv("JWT_ACCESS_SECRET");
  },
  get JWT_REFRESH_SECRET(): string {
    return requireEnv("JWT_REFRESH_SECRET");
  },
  get REDISURL():string{
    return requireEnv('REDIS_URL')
  },
  get NodeMailEmail():string{
    return requireEnv('NodeMailEmail')
  }
  ,
  get MAILPASS():string{
    return requireEnv('MAILPASS')
  }
  ,
  get otpTimelimit():number{
    return Number(requireEnv('OTPTIME'))
  },
  get userTime():number{
    return Number(requireEnv('USERTIMELIMIT'))
  }

};
