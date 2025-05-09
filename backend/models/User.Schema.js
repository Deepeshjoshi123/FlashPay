import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    require: true,
    unique: true,
    type: String,
  },
  fullname: {
    required: true,
    type: String,
  },
  email: {
    require: true,
    unique: true,
    type: String,
  },
  password: {
    require: true,
    type: String,
  },
});

const User = mongoose.model("User", UserSchema);
export default User;
