const { Router } = require("express");
const reroute = Router();
const vidControl = require("../controllers/vidControl");

// Sending queries along their route according to the type of request received
reroute.get("/getvideos", vidControl.getVideos);
reroute.post("/searchvideos", vidControl.searchVideos);

module.exports = reroute;
