const VideoQuery = require("../models/videoModel");

// Code for GET requests
module.exports.getVideos = async (req, res) => {
  try {
    const pages = req.query.p;
    const VidQueries = await VideoQuery.find().sort({ publishTime: -1 });
    if (!VidQueries)
      return res.status(404).json({ message: "Videos not found" });

    // Splits the queries into different parts ensuring they are paginated into different page segments
    const pageCount = Math.ceil(VidQueries.length / 6);
    let page = parseInt(pages);
    if (!page) page = 1;
    if (page > pageCount) page = pageCount;
    const videos = VidQueries.slice(page * 6 - 6, page * 6);

    // Return the videos in a paginated manner
    return res.status(200).json({
      page,
      pageCount,
      videos,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error in fetching videos", error });
  }
};

// Code for POST requests aka searching
module.exports.searchVideos = async (req, res) => {
  try {
    const { query } = req.body;
    const videos = await VideoQuery.find({ $text: { $search: query } });
    if (!videos) return res.status(404).json({ message: "Videos not found" });
    return res.status(201).json({ videos });
  } catch (error) {
    return res.status(500).json({ message: "Error in search videos", error });
  }
};
