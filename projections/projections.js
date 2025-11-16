import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();

const db = client.db("hostelDB");
const collection = db.collection("hostels");

const cursor = collection.find(
  {}, 
  { projection: { name: 1, phone:1,area:1, _id: 0 } }
).limit(4);

// iterate document by document
for await (const doc of cursor) {
  console.log(doc);
}

await client.close();
