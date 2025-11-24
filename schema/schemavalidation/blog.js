import{MongoClient } from "mongoDB"
import { BSON } from "mongoDB"
const client=new MongoClient("mongodb://localhost:27017")
client.connect()
const db=client.db('test')
const usersCollection= db.collection("users");

const doc = {
  name: "Prathamesh",
  age: 19,
  active: true
};
const inserDoc= await usersCollection.insertOne({doc})

client.close();



