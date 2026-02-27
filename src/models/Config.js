const mongoose = require("mongoose");

const entityConfigSchema = new mongoose.Schema(
  {
    entity: {
      type: String,
      required: true,
      unique: true,
    },

    label: {
      type: String,
      required: false,
    },

    config: {
      type: mongoose.Schema.Types.Mixed, // équivalent JSON
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("EntityConfig", entityConfigSchema);
