// require("dotenv").config();
("use strict");
const { Client } = require("@elastic/elasticsearch");
const MAX_RETRIES = 5;
const INITIAL_BACKOFF = 1000; // 1 second

let client;

function createClient() {
  return new Client({
    node: process.env.ELASTIC_NODE,
    cloud: {
      id: process.env.ELASTIC_CLOUD_ID,
    },
    auth: {
      username: process.env.ELASTIC_USERNAME,
      password: process.env.ELASTIC_PASSWORD,
    },
    maxRetries: 10,
    requestTimeout: 120000,
    pingTimeout: 120000,
    sniffOnStart: false,
    keepAlive: true,
    keepAliveInterval: 60000,
    ssl: {
      rejectUnauthorized: false,
    },
  });
}

async function checkElasticsearchConnection() {
  if (!client) {
    client = createClient();
  }

  try {
    const info = await client.info();
    console.log("Connection to Elasticsearch is successful.");
    console.log("Elasticsearch version:", info.version.number);
    return client;
  } catch (error) {
    console.error("Elasticsearch connection failed:", error);
    if (error.meta) {
      console.error("Status Code:", error.meta.statusCode);
      console.error("Request Details:", error.meta.request);
    }
    throw error; // Re-throw the error so the caller knows the connection failed
  }
}

async function retryWithBackoff(operation, retries = MAX_RETRIES) {
  for (let i = 0; i < retries; i++) {
    try {
      return await operation();
    } catch (err) {
      if (i === retries - 1) throw err;
      const delay = INITIAL_BACKOFF * Math.pow(2, i);
      console.log(`Attempt ${i + 1} failed. Retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

module.exports = {
  checkElasticsearchConnection,
  createClient,
  retryWithBackoff,
};
