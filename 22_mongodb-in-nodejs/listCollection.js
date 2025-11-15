
import {MongoClient} from "mongodb"

const client=new MongoClient('mongodb://localhost:27017/')
await client.connect();

const db=client.db("hostelDB");
const collections= db.collection('user')
const data=await collections.find().toArray()
console.log(data);
client.close()