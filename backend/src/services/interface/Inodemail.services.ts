export interface Inodemailservices{
    sendOtp(otp: string, email: string, name: string):Promise<void>
}