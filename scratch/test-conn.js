const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

// Manually parse .env.local
let uri = "";
try {
  const envContent = fs.readFileSync(path.join(__dirname, "../.env.local"), "utf8");
  const match = envContent.match(/^MONGODB_URI=(.+)$/m);
  if (match) {
    uri = match[1].trim();
  }
} catch (e) {
  console.error("Could not read .env.local file", e);
}

if (!uri) {
  console.error("MONGODB_URI is not defined in .env.local");
  process.exit(1);
}

console.log("Attempting to connect with URI:", uri.replace(/:[^@]+@/, ":****@"));

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("SUCCESS: Connected to MongoDB Atlas!");
    const db = client.db();
    const collections = await db.listCollections().toArray();
    console.log("Collections found:", collections.map(c => c.name));
  } catch (error) {
    console.error("FAILURE: Connection failed with error:");
    console.error(error);
  } finally {
    await client.close();
  }
}

run();
