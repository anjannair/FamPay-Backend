const { Schema, model } = require("mongoose");

const VideoSchema = new Schema({
  title: String,
  description: String,
  channelTitle: String,
  thumbnail: String,
  videoId: String,
  publishTime: {
    type: Date,
    required: true,
  },
});

VideoSchema.index({ title: "text", description: "text" });
const Videos = model("videos", VideoSchema);
module.exports = Videos;
