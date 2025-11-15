
import {MongoClient} from "mongodb"

const client=new MongoClient('mongodb://localhost:27017/')
await client.connect();

const db=client.db("MongoNodePractice");
const collection= db.collection('user')
//find
const data= await collection.find({gender:"female"}).toArray()

console.log(data);

