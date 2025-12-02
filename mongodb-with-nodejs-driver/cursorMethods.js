
import {MongoClient} from "mongodb"

const client=new MongoClient('mongodb://localhost:27017/', { monitorCommands: true })
await client.connect();




const db=client.db("hostelDB")
const hostelCollection= db.collection("hostels") 
const cusror= hostelCollection.find()
console.log(await cusror.toArray());


client.close()