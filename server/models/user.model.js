import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: "Name is required",
  },
  email: {
    type: String,
    trim: true,
    required: "Email is required",
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: Date,
  hashed_password: {
    type: String,
    required: "Password is required",
  },
});

UserSchema.methods = {
  encryptPassword: async function (password) {
    const hash = await bcrypt.hash(password, 10);
    this.hashed_password = hash;
  },
  authenticate: async function (input) {
    const result = await bcrypt.compare(this.hashed_password, input);
    return result;
  },
  serialize: function () {
    const data = this.toJSON();
    delete data.hashed_password;
    return data;
  },
};

UserSchema.statics.findByEmail = function (email) {
  return this.findOne({ email });
};

const User = mongoose.model("User", UserSchema);
export default User;
