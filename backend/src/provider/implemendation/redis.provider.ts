import { redisServer } from "@/config/redis.config";
export class redisProvider implements iRedisProvider {
  private redis;
  constructor() {
    this.redis = redisServer;
    this.redis.on("error", (err) => {
      console.error("Redis Error:", err);
    });

    this.redis
      .connect()
      .then(() => {
        console.log("redis connected success");
      })
      .catch((err) => {
        console.log("Redis : ", err);
      });
  }
  async storeData(
    key: string,
    value: string,
    timeLimit: number
  ): Promise<string> {
    return await this.redis.setEx(key, timeLimit, value);
  }
  async getData(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }
  async deleteOtp(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
