const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = Schema(
  {
    name: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true, select: false },
    avatarUrl: { type: String, require: true, default: "" },
    coverUrl: { type: String, require: false, default: "" },
    aboutMe: { type: String, require: false, default: "" },
    city: { type: String, require: false, default: "" },
    country: { type: String, require: false, default: "" },
    company: { type: String, require: false, default: "" },
    jobTitle: { type: String, require: false, default: "" },
    facebookLink: { type: String, require: false, default: "" },
    instagramLink: { type: String, require: false, default: "" },
    linkedinLink: { type: String, require: false, default: "" },
    twitterLink: { type: String, require: false, default: "" },
    isDeleted: { type: Boolean, default: false, select: false },
    friendCount: { type: Number, default: 0 },
    postCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
