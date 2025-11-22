
import {MongoClient, ObjectId} from "mongodb"

const client=new MongoClient('mongodb://localhost:27017/')
await client.connect();

const db=client.db();
 const userCollection=db.collection("users")
 const data=await userCollection.find().toArray();
const usersData=[
    {
        "name": "ded ",
        "age": 25,
        "email": "alice.johnson@example.com",
        "jobTitle": "Software Developer",
        "experience": "3 years"
    },
    {
        "name": "mjhm ",
        "age": 30,
        "email": "bob.smith@example.com",
        "jobTitle": "Data Analyst",
        "experience": "5 years"
    },
    {   _id:new ObjectId("6921819a491902ef64d3b1b3"),
        "name": "ewewe ",
        "age": 28,
        "email": "charlie.brown@example.com",
        "jobTitle": "Project Manager",
        "experience": "6 years"
    },
    {
        "name": "referf ",
        "age": 32,
        "email": "diana.adams@example.com",
        "jobTitle": "UX Designer",
        "experience": "7 years"
    },
    {
        "name": "rrrr ",
        "age": 24,
        "email": "ethan.wright@example.com",
        "jobTitle": "Front-End Developer",
        "experience": "2 years"
    },
    {
        "name": "rrrrrr ",
        "age": 29,
        "email": "fiona.green@example.com",
        "jobTitle": "HR Specialist",
        "experience": "5 years"
    },
    {
        "name": "wwwwww ",
        "age": 35,
        "email": "george.wilson@example.com",
        "jobTitle": "DevOps Engineer",
        "experience": "8 years"
    },
    {
        "name": "qqqq",
        "age": 27,
        "email": "hannah.lee@example.com",
        "jobTitle": "Digital Marketer",
        "experience": "4 years"
    },
]
 const insertDoc=await userCollection.insertMany(usersData,{ordered:false});
 


client.close()