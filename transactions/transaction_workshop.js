import { MongoClient, ObjectId } from 'mongodb';

// 1. Connection
// Transactions REQUIRE a Replica Set.
const uri = 'mongodb://localhost:27017/?replicaSet=rs0';
const client = new MongoClient(uri);

await client.connect();

const db=client.db("mybd1");

const userColl=db.collection("users")
const fileCOll=db.collection("files")
const userId=new ObjectId();

const session=client.startSession()
try{
     await  session.withTransaction(async()=>{
        const insertUser= await userColl.insertOne({name:"Prathamesh"},{session});
          const insertFiles=await fileCOll.insertOne({name:"Some.txt",userId:userId},{session})
      })
}catch(error){
    console.log(error);
    
}finally{
    await session.endSession()
}

client.close();


