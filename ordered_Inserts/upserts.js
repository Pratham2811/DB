
import {MongoClient, ObjectId} from "mongodb"

const client=new MongoClient('mongodb://localhost:27017/')
await client.connect();

const db=client.db();
 const userCollection=db.collection("users")
 const data=await userCollection.find().toArray();

//upserts if document is founded then updated after that document is updated but when document is not found 
//then then what upserts does is the create insert document filter is part of document create id automatically and after that in insert whole document 

const upsertDataSample=await userCollection.updateOne({name:"Prathamesh Madane"},{$set:{age:21}},{upsert:true})

//   let r1 = await userCollection.updateOne(
//     { username: "prathamesh" },
//     { $set: { score: 10 } },
//     { upsert: true }
//   );
 

  let r2 = await userCollection.updateOne(
    { username: "prathamesh" },
    { $inc: { score: 50 } },
    { upsert: true }
  );

client.close()