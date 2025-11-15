
import {MongoClient} from "mongodb"

const client=new MongoClient('mongodb://localhost:27017/')
await client.connect();

const db=client.db("MongoNodePractice");
const collections= db.collection('user')
//insertion
const users=[
  {
    
    name: "Prathamesh Madane",
    age: 19,
    gender: "male",
    room: "A-101",
    year: 2,
    feesPaid: true,
    hobbies: ["cricket", "gym"],
    address: { city: "Pune", state: "MH", pincode: 411001 },
    joinedAt: new Date("2024-07-10"),
    email: "prathamesh@example.com"
  },
  {
   
    name: "Karan Sharma",
    age: 20,
    gender: "male",
    room: "A-102",
    year: 2,
    feesPaid: false,
    hobbies: ["reading", "music"],
    address: { city: "Mumbai", state: "MH", pincode: 400001 },
    joinedAt: new Date("2024-06-25"),
    email: "karan@example.com"
  },
  {

    name: "Rohit Patil",
    age: 21,
    gender: "male",
    room: "A-102",
    year: 3,
    feesPaid: true,
    hobbies: ["coding", "football"],
    address: { city: "Nashik", state: "MH", pincode: 422001 },
    joinedAt: new Date("2024-07-01"),
    email: "rohit@example.com"
  },
  {
 
    name: "Sneha Kulkarni",
    age: 18,
    gender: "female",
    room: "B-201",
    year: 1,
    feesPaid: false,
    hobbies: ["dance", "drawing"],
    address: { city: "Pune", state: "MH", pincode: 411002 },
    joinedAt: new Date("2024-07-15"),
    email: "sneha@example.com"
  },
  {

    name: "Aditi Deshmukh",
    age: 19,
    gender: "female",
    room: "B-202",
    year: 2,
    feesPaid: true,
    hobbies: ["music", "coding"],
    address: { city: "Pune", state: "MH", pincode: 411003 },
    joinedAt: new Date("2024-07-02"),
    email: "aditi@example.com"
  }

]
const insertusers=await collections.insertMany(users)
console.log(insertusers);


//finding

collections.find({ gender: "female"})
client.close()
