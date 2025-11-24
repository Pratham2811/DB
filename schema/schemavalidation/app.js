import{MongoClient } from "mongoDB"
import { BSON } from "mongoDB"
const client=new MongoClient("mongodb://localhost:27017")
client.connect()
const db=client.db('test')
const usersCollection= db.collection("users");
// const userData=await usersCollection.find().toArray();
// await db.command({collMod:'users',
//     validator:{
        
//   name: {
//     $type: 'string'
//   },
//   age: {
//     $type: 'int',
//     $gte:18,
//     $lte:25
//   },
//   location: {
//     $type: 'string',
//     $ne:"Pune"
//   }

//     },
//     validationLevel:"strict",
//     validationAction:"error"

// })  //this is how we chnage or insert schema in the existing collections in database 

// const insertuser=await usersCollection.insertOne({
//     name:"Prathamesh",
//    age:18,
//    location:"Pune"
// })
const doc= await usersCollection.findOne({age:18})
const bufferedDoc=BSON.serialize(doc)
console.log(bufferedDoc);

client.close();

