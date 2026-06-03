import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

const uri = process.env.MONGODB_URI;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function createClient(): Promise<MongoClient> {
  const client = new MongoClient(uri);
  return client.connect();
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development, cache in global to survive HMR restarts.
  // But if the cached promise rejected, clear it so the next request retries.
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = createClient();
  }

  // Attach a rejection handler that clears the cache so the next request retries
  global._mongoClientPromise.catch(() => {
    global._mongoClientPromise = undefined;
  });

  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = createClient();
}

export default clientPromise;

export async function getDb() {
  // In case the cached promise failed and was cleared, create a fresh one
  if (process.env.NODE_ENV === "development" && !global._mongoClientPromise) {
    global._mongoClientPromise = createClient();
    global._mongoClientPromise.catch(() => {
      global._mongoClientPromise = undefined;
    });
    clientPromise = global._mongoClientPromise;
  }

  const connection = await clientPromise;
  return connection.db();
}
