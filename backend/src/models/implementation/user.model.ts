import mongoose, { Document, Schema, Types } from "mongoose";
import { IUser } from "shared/types";

export interface IUserDocument extends Document, Omit<IUser, "_id"> {}

const userSchema = new Schema<IUserDocument>({

  username: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "member"],
    default: "member",
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

export const userModel = mongoose.model<IUserDocument>("User", userSchema);
