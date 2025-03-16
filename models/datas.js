import mongoose from "mongoose";

const DataSchema = new mongoose.Schema(
  {
    timer: {
      type: String,
    },
    token: {
      type: Object,
    },
    tokenomics_link: {
      type: String,
    },
    whitepaper_link: {
      type: String,
    },
    whitepaper_text: {
      type: String,
    },
  },
  { timestamp: true }
);

export default mongoose.model("datas", DataSchema);
