const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  playingSince: {
    type: Date,
  },
  dci: {
    type: Number,
  },
  formatsPlayed: {
    vintage: {
      type: Boolean,
    },
    legacy: {
      type: Boolean,
    },
    modern: {
      type: Boolean,
    },
    pioneer: {
      type: Boolean,
    },
    pauper: {
      type: Boolean,
    },
    commander: {
      type: Boolean,
    },
    standart: {
      type: Boolean,
    },
    brawl: {
      type: Boolean,
    },
  },

  onlyBuying: {
    type: Boolean,
  },
  onlyTrading: {
    type: Boolean,
  },
  have: {
    common: {
      type: [String],
    },
    uncommon: {
      type: [String],
    },
    rare: {
      type: [String],
    },
    mythic: {
      type: [String],
    },
  },
  want: {
    common: {
      type: [String],
    },
    uncommon: {
      type: [String],
    },
    rare: {
      type: [String],
    },
    mythic: {
      type: [String],
    },
  },
});
module.exports = mongoose.model("profile", ProfileSchema);
