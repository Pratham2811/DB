
import {MongoClient} from "mongodb"

const client=new MongoClient('mongodb://localhost:27017/')
await client.connect();

const db=client.db("hostelDB");
const usercollection= db.collection('user')
//find
// //dropping collection
// const dropUser= await collection.drop();
// console.log(dropUser);

//delete one 

const hostelsCollection= db.collection("hostels")
// const hostelData=await hostelsCollection.find({area:'Wakad'}).toArray()
// const deletedValue=await hostelsCollection.deleteOne({area:"Wakad"})
// console.log(deletedValue);

//deleteing specific field in documents 

const updatedocuments=await hostelsCollection.updateMany({},{$set:{city:'pune'}})
//deletinf fields from many as well as single documents 
// const deletefeilds=await hostelsCollection.updateOne({},{$unset:{married:''}})
const deletefeilds=await hostelsCollection.updateMany({},{$unset:{married:''}})
console.log(deletefeilds);

console.log(updatedocuments);

client.close()