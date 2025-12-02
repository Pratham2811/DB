
import {MongoClient} from "mongodb"

const client=new MongoClient('mongodb://localhost:27017/')
await client.connect();


//to seee all dbs we have to create instance of dbs and that instance is what we call the admin instance on that admin we can see all listeed data bases 

const db=client.db().admin()
const  allDbs=await db.listDatabases();

console.log(allDbs);
//we close the connection if we dont close the connec t it will be connected till computer is one or mongo server is on 
client.close()