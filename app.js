require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
var cors = require("cors");
let path = require("path");
const bodyParser = require("body-parser");

// Importing custom functions
const { fetchYouTubeVids } = require("./youtube/fetchAPI");
const videoRoutes = require("./routes/videosRoutes");
const { response } = require("express");
const { request } = require("http");

const app = express();

// App Uses
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Enabling CORS middleware
app.use(cors());
app.use(express.static("public"));

// Using EJS view engine
app.set("view engine", "ejs");
// Default view directory is set to views. We change that over here to frontend
app.set("views", path.join(__dirname, "/frontend"));

// Dashboard Reroute
app.get("/", async function (req, res) {
  const response = await axios.get(
    `http://127.0.0.1:${process.env.PORT}/videos/getvideos?p=1`
  );
  // Storing the response
  const video_data = response.data.videos;
  console.log(video_data);
  res.render("index", { videos: video_data });
});

// Video Reroute
app.use("/videos", videoRoutes);

//Fetching Youtube API , every 1 minute
setInterval(fetchYouTubeVids, 60000);

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
      console.log(`Server is up and running on http://127.0.0.1:${PORT}`);
    });
  });
