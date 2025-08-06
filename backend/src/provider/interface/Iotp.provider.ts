export interface IotpProvider {
  
  get getOtp(): number;
  getExpiry(): Date;
}
