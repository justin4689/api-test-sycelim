const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    user_nom: {
      type: String,
      required: true,
      trim: true,
    },

    user_prenoms: {
      type: String,
      required: true,
      trim: true,
    },

    user_genre: {
      type: String,
      enum: ["Homme", "Femme"],
      required: true,
    },

    user_date: {
      type: Date,
      required: true,
    },

    user_login: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    user_password: {
      type: String,
      required: true,
      trim: true,
    },

    user_email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    user_mobile: {
      type: String,
    },

    user_active: {
      type: Boolean,
      default: true,
    },

    user_creation: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("User", userSchema);
