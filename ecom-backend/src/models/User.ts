import mongoose, { InferSchemaType, Schema, HydratedDocument } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contact: { type: String, required: true },
  refreshToken: { type: String },
});

export type UserSchema = InferSchemaType<typeof userSchema>;
export type UserDocument = HydratedDocument<UserSchema>;

export const User = mongoose.model<UserSchema>("User", userSchema);
