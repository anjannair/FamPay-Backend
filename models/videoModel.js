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

// We add this text operator to search all fields included in the text index
// This allows us to utilize MongoDB's Full Text Search feature - https://www.mongodb.com/basics/full-text-search
VideoSchema.index({ title: "text", description: "text" });

const Videos = model("videos", VideoSchema);
module.exports = Videos;
