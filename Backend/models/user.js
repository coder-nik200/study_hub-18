const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      // select: false, // 🔐 hide password by default
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      required: true,
    },

    avatar: {
      type: String, // image URL
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
