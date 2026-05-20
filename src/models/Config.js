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

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: false,
    },

    config: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("EntityConfig", entityConfigSchema);
