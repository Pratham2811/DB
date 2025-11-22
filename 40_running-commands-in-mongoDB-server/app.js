import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017/newDB");

await client.connect();

const db = client.db("test");

// await db.createCollection("vegetables");

// const result=await db.command({listCollections:1});
// console.log(result.cursor.firstBatch);

// const result=await db.command({validate: "myCollections"});
// console.log(result);

//we can insert single as well multiples docs

// const insertDoc= await db.command({
//     insert:"users",
//     documents:[
//         {name:"Prathamesh"}
//     ]
// })
// console.log(insertDoc);
// const insertDoc= await db.command({
//     insert:"users",
//     documents:[
//          { name: "Alice", age: 30 },
//          { name: "Bob", age: 22 },
//            { name: "Alice", age: 30 },
//          { name: "Bob", age: 22 }
//     ]
// })
// console.log(insertDoc);

// const insertDoc= await db.command({
//     find:"users",
//      filter: { age: { $gt: 25 } },
//   projection: { _id: 0, name: 1, age: 1 },
//   limit: 5,
// })
// const insertDoc= await db.command({
//     find:"users",
//      filter: { },
//   projection: { _id: 0, name: 1, age: 1 },
//     //  limit: 5,//only give first 5 doc
// })
const insertDoc= await db.command({
    update:"users",
     updates: { age: { $gt: 25 } },
  projection: { _id: 0, name: 1, age: 1 },
  limit: 5,
})
console.log(insertDoc.cursor.firstBatch);

client.close();
