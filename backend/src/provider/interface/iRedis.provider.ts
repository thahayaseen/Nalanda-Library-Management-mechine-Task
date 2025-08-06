interface iRedisProvider {
  storeData(key: string, value: string, timeLimit: number): Promise<string>;
  getData(key: string): Promise<string | null>;
  deleteOtp(key: string): Promise<void>
}
