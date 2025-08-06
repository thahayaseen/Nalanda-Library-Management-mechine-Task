import mongoose, { Document, Schema ,Types} from "mongoose";
import { IUser } from "shared/types";

export interface IUserModel extends Document, Omit<IUser, "_id"> {}

const userSchema = new Schema<IUserModel>({
  _id:Types.ObjectId,
  username: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
});

export const userModel = mongoose.model<IUserModel>("User", userSchema);
