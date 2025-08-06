export interface IotpProvider {
  
  getOtp(): number;
  getExpiry(): Date;
}
