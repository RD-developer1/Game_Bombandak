/*******************************************************
 *      Server Starts From Here                        *
 *******************************************************/
"use strict";

require("dotenv").config();
const http = require("http");
const app = require("./app");
const serverController = require("./modules/server/serverController");
const port = process.env.PORT || 4000;
const env = process.env.ENV || "Development";
const server = http.createServer(app);

app.set("PORT_NUMBER", port);

//  Start the app on the specific interface (and port).
server.listen(port, async () => {
  const data = new Date();
  console.log("|--------------------------------------------");
  console.log("| Environment  : " + env);
  console.log("| Port         : " + port);
  console.log("| Date         : " + data.toJSON().split("T").join(" "));
  console.log("|--------------------------------------------");
  console.log("| Server is listening on 4000! ");
  console.log("|--------------------------------------------");
  
  // Run status check automatically on startup
  await serverController.runOnStartup();
});

process.on("SIGTERM", () => {
  server.close(() => {
    process.exit(0);
  });
});

module.exports = server;
