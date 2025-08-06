import { IotpProvider } from "../interface/Iotp.provider";

export default class Otp implements IotpProvider {
    private otp: number;
    private expiresAt: Date; 

    constructor() {
        this.otp = this.generateOtp();
        this.expiresAt = new Date(Date.now() + 5 * 60 * 1000); 
    }

    private generateOtp(): number {
        return Math.floor(100000 + Math.random() * 900000); 
    }

    getOtp(): number {
        return this.otp;
    }

    getExpiry(): Date {
        return this.expiresAt;
    }
}
