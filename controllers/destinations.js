const Airlines = require("../models/airlines");
const Destinations = require("../models/destinations");

module.exports.index = async (req, res) => {
  const { slug } = req.params;
  const destinations = await Airlines.findOne({ slug }).populate({
    path: "destinations",
  });

  // res.render("destinations/index", { destinations });
  res.json(destinations);
};
