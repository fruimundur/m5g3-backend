//requiering express and initializing the app:
const express = require('express')

//requiering the cors middleware:
const cors = require('cors');
require('dotenv').config();

const { ObjectId } = require('mongodb');

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://fruimund:${process.env.MONGOPASS}@cluster0.lkim3qg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const app = express();
const PORT = 5002; //we will use port 5001
client.connect(async err => {
console.log("connected!!",err);
});

app.use(cors());//telling express to use the cors middleware
app.use(express.json())//telling express to accept json in body of POST requests

app.get('/',async (req,res)=>{ //listen to a get request
  const collection = client.db("Blog").collection("blogs");
  const data = await collection.find().toArray();
  res.send(JSON.stringify(data))
})


app.post('/m/blog',async (req,res)=>{ //listen to a post request  
  console.log(req.body);
  // client.connect(async err => {

    const collection = client.db("Blog").collection("blogs");
    // console.log("connected!!",err);
    //perform actions on the collection object
    //find everything in the collection and turn it into an array:
    collection.insertOne(req.body).then(()=>{
      res.send({message:"success"})
    }).catch((e)=>{
      res.send(e);
    })
    
  // });
})

app.delete('/m/blog/:id',async (req,res)=>{
   const collection = client.db("Blog").collection("blogs");
   const result = await collection.deleteOne({_id: new ObjectId(req.params.id)})
   res.send(result)
})

app.put('/m/blog/:id', async (req,res)=>{
  const collection = client.db("Blog").collection("blogs");
  console.log(req.params,req.body)
  const result = await collection.updateOne({_id: new ObjectId(req.params.id)}, {$set: req.body})
  res.send(result)
})


app.listen(PORT, ()=>{ //listen to the port we chose above
    //print to the console that the server is listening
    console.log("listening to port: " + PORT);
})

//export for vercel

module.exports = app;