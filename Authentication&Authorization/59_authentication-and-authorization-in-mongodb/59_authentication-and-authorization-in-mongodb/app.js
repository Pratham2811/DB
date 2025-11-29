import { MongoClient } from "mongodb";

// const connectionUrl = "mongodb://anurag:anurag@127.0.0.1:27018/storageApp";
const connectionUrl =
  "mongodb://madane:madane@127.0.0.1:27018/hostel?authSource=admin";
  
const client = new MongoClient(connectionUrl);

await client.connect();

const db = client.db();
const collection = db.collection("users");
// const data = await collection.find().toArray();
// const insertData=await collection.insertOne({name:"nenje"})

// console.log(data);
// await db.command({collMod:'users',validator:{
// }})




await db.createUser({user:'prathamesh',pwd:'prathamesh',roles:[{role:"read",db:'hostel'}]})

console.log("client connected");

client.close();
