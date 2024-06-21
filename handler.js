const serverless = require("serverless-http");
const app = require("./app"); // main Express app file is named app.js

// Export the serverless handler function
module.exports.handler = serverless(app);
