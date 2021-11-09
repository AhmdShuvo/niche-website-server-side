const { MongoClient } = require("mongodb");
const express=require('express');
const cors=require('cors');


const app=(express())


require("dotenv").config();

const port =process.env.PORT||9000;


app.use(express.json())
app.use(cors())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_pass}@cluster0.0qtlc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
      await client.connect();
      console.log("Connected");
      const database = client.db('Cars-Server');
      const servicesCollection = database.collection('Cars');

         app.get('/cars',async(req,res)=>{
            const cursor=servicesCollection.find({});

            const result=await cursor.toArray()

        res.json(result)
      })
    } finally {
      // Ensures that the client will close when you finish/error
    //   await client.close();
    }
  }
  run().catch(console.dir);


 
  app.get('/',async(req,res)=>{
           
   res.send("server Running")
         

  })

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })