// const Airlines = require("../models/airlines");
// const Destinatons = require("../models/destinations");

// module.exports.index = async (req, res) => {
//   const airlines = await Airlines.find();
//   // return res.render("airlines/index", { airlines });

//   res.json(airlines);
// };

// module.exports.destinationIndex = async (req, res) => {
//   const airlineDestinations = await Airlines.find({}).populate({
//     path: "destinations",
//   });
//   res.json(airlineDestinations);
// };

// module.exports.showPage = async (req, res) => {
//   const { slug } = req.params;
//   // const showPage = await Airlines.findOne({ slug });
//   const destinations = await Airlines.findOne({ slug }).populate(
//     "destinations",
//   );
//   //res.render("airlines/showPage", { showPage, destinations });
//   res.json(destinations);
// };
