require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
var cors = require("cors");
let path = require("path");

// Importing custom functions
const { fetchYouTubeVids } = require("./youtube/fetchAPI");
const videoRoutes = require("./routes/videosRoutes");

const app = express();
app.use(express.json());

// Using EJS view engine
app.set("view engine", "ejs");
// Default view directory is set to views. We change that over here to frontend
app.set("views", path.join(__dirname, "/frontend"));
app.use(express.static("public"));
// Enabling CORS middleware
app.use(cors());

// Dashboard Reroute
app.get("/", async function (req, res) {
  const response = await axios.get(
    "http://localhost:3000/videos/getvideos?p=1"
  );
  // Storing the response
  const video_data = response.data.videos;
  console.log(video_data);
  res.render("index", { videos: video_data });
});

// Video Reroute
app.use("/videos", videoRoutes);

//Fetching Youtube API , every 10 secs
setInterval(fetchYouTubeVids, 10000);

//Setting up database and backend Server
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is up and running on http://localhost:${PORT}`);
    });
  });
