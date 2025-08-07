import { IUser } from "shared/types";

export class userProfileDto {
  private name;
  private email;
  private role;
  constructor({ email, username, role }: IUser) {
    this.name = username;
    this.email = email;
    this.role = role;
  }
}
