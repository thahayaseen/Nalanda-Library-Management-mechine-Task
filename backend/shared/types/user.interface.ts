export interface IUser {
  _id?: string;
  username: string;
  role: "admin" | "user";
  email: string;
  password: string;
  isVerified:boolean
}
export interface ImostActiveUser{
  name:string;
  email:string;
  totalBorrows:number
}