what I Have Explored till now is how mongDB query cycle looks like

phase one

query we we do to insert retrive or update data 

![alt text](<Screenshot 2025-11-23 174209.png>)

this is the javascript object that live in memory when code runs 

when we want to insert this doc 
await db.users.insertOne(doc);
this doc is passed to the MongoDB node js driver 

step 2 when mongoDb node driver (any driver python,java) here JSON or Js object is converted to BSON (Binary Json)

doc is passed when query runs
driver  reads every key and value 
and encode its to its respective BSON value using BSON library in node js driver

BSON library is some type of encoder and decodr 
JSON to BSON 
BSON to JSOn

How it maps or convert the JSON to BSON is 

suppose you have this doc
 
{
  "name": "Prathamesh",
  "age": 19,
  "isStudent": true
}

the same doc how looks like in BSON

this is mapping hoe BSON lib converts JSON to BSON

16 00 00 00                // total document size
02                         // type: string encoded in json as 02
6e 61 6d 65 00             // key: "name" key is represent in binary 
0b 00 00 00                // string length  //lemgth of string 
50 72 61 74 68 61 6d 65 73 68 00    // "Prathamesh"

this is what mapping looks like 
this binary file we call it hex dump file 

now the bson buffer is produced by same BSON lib
const bson = BSON.serialize(doc)
console.log(bson)

<Buffer 31 00 00 ... 00>


This BSON Buffer is inserted into a MongoDB Wire Protocol Packet

Header (message length, opCode)
Namespace: "database.collection"
Document count
BSON Document

this what network call looks likde typical 
first 3 re syn sync -ack ack

looks at extensible query where the our wuery or data packet goes from


step 5 mongo db server reads the packet on port 27017

Extract document from upcoming packet 

apply schema validation checks if schema is valid or not 
here Schema is also store in bson format eg:$jsonSchema validator 

mongo core compare Doc BSON to Schema BSOn

if true then doc goes to mongo storage engine 
if validation failed it return error to driver and nothing is stored 

when wired tiger (storage engine recives the document )
then it is compressed 

according to doc it is saved in pages and after that pages  are stored in .wt files

what are actually .wt files??
it is the actual storage where document or data lives 
or pages are stored in .et files 