import{MongoClient } from "mongoDB"

const client=new MongoClient("mongodb://localhost:27017")
client.connect()
const db=client.db('test')
const FilesCollection= db.collection("users");
// const userData=await usersCollection.find().toArray();

//creating collections explicitly,
// await db.createCollection("users") // this method on db 



//2nd method is by running command on mongosb server
// await db.command({create:"expenses"})

//how add validation while creating collection explicitely
// await db.createCollection("dirs",{
//     validator:{
//         age:{
//             $type:"int",
//             $gte:18

//         },
//         name:{
//             $type:"string"
//         }
//     },
//     validationAction:"warn",
//     validationLevel:"strict"

// })
// await db.command({collMod:'files',
//     validator:{
//         age:{
//             $type:"int"
//         },
//         name:{
//             $type:"string"
//         }
//     },
//     validationAction:"warn",
//     validationLevel:"moderate"
// })

// const insertuser=await usersCollection.insertOne({
//     name:"Prathamesh",
//    age:18,
//    location:"Pune"
// })


client.close();