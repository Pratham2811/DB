
import {MongoClient} from "mongodb"

const client=new MongoClient('mongodb://localhost:27017/', { monitorCommands: true })
await client.connect();




const db=client.db("hostelDB")
const hostelCollection= db.collection("hostels") 
const cusror= hostelCollection.find()
console.log(cusror.id);
const collection=db.collection("users");

// console.log(await cusror.next());
// console.log(await cusror.next());
// console.log(await cusror.next());
// console.log(await cusror.next());
// console.log(await cusror.next());
// console.log(await cusror.next());
// console.log(await cusror.next());

// while(await cusror.hasNext()){
//     console.log(await cusror.next());

    
// }
// console.log(await cusror.count()); //counts documents in cursor  anmd depreceted method it is 
 console.log(await hostelCollection.countDocuments()); //counts documents in the collections
 

//cursor is object in the eye of js 
//it is async iterator means interator thorugh documents asynchronously

client.close()