// server.js
"use strict";
require("dotenv").config();
const express = require("express");
const server=require('./src/server')
const routers = require("./src/routers");
const http = require("http");
const prefillDatabase = require("./src/db/prefill");
const { checkElasticsearchConnection } = require("./src/db/connections");
const app = express();
app.use(server.morgan);
app.use(server.cors);
app.use(server.urlEncoded);
app.use(server.json);
app.use(server.cookie);


app.get("/", function (req, res) {
  res.json("conucle.io Server Composer!");
});


app.use('/items',routers.items)

const httpServer = http.createServer(app);

httpServer.listen(server.port, server.host, async () => {
  server.message();
  try {
    const client = await checkElasticsearchConnection();
    console.log("Elasticsearch connection successful");

    console.log("Starting database prefill...");
    await prefillDatabase(client); // Pass the client to prefillDatabase if needed
    console.log("Database prefill process completed");
  } catch (error) {
    console.error("Error during server startup:", error);
    // Decide whether to exit the process or continue with reduced functionality
    // process.exit(1);
  }
});


