const axios = require("axios");

// Importing the utilities
const { API_URL } = require("./utils");
var { YOUTUBE_KEY } = require("./utils");

// Importing the model for the schema
const videoModel = require("../models/videoModel");

// The predefined query parameters
const queries = [
  "prank",
  "technology",
  "funny",
  "swimming",
  "watches",
  "cooking",
  "maths",
];

// For load balancing between different keys we randomize the keys
const FINAL_KEY = YOUTUBE_KEY.split(",");

module.exports.fetchYouTubeVids = async () => {
  try {
    const query = queries[Math.floor(Math.random() * queries.length)];
    const URL = `${API_URL}/search?key=${FINAL_KEY[Math.floor(Math.random() * FINAL_KEY.length)]}&type=video&order=date&publishedAfter=2022-11-20T00:00:00.0Z&part=snippet&q=${query}`;
    // Waiting for the response
    const response = await axios.get(URL);
    // Storing the response
    const video_data = response.data.items;
    console.log(video_data);
    // Sometimes no results are returned
    if (!video_data) {
      return;
    }
    // Getting and storing the video data
    const metadataList = [];
    video_data.forEach((vid) => {
      const metadata = {};
      metadata["videoId"] = vid.id.videoId;
      metadata["title"] = vid.snippet.title;
      metadata["description"] = vid.snippet.description;
      metadata["channelTitle"] = vid.snippet.channelTitle;
      metadata["publishTime"] = vid.snippet.publishTime;
      metadata["thumbnail"] = vid.snippet.thumbnails.high.url;
      metadataList.push(metadata);
    });
    await videoModel.updateMany(metadataList);
  } catch (e) {}
};
