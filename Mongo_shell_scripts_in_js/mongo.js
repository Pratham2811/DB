use("hostelDB")
// db.users.insertOne({name:"Prathmaesh"})
//  console.log(db.users.find());
//  db.users.insertOne({taskCOmpleted:true})

//can insert on loop 
const userCollection=db.getCollection("user")
for(let i=0;i<10000;i++){
    userCollection.insertOne({name:`$user${i}`,password:`${(Math.random()*1000000)+1}`})
}
