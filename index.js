const { MongoClient } = require("mongodb");
const Objectid=require('mongodb').ObjectId;
const express=require('express');
const cors=require('cors');
require("dotenv").config();


const app=(express())




const port =process.env.PORT || 9000;


app.use(express.json())
app.use(cors())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0qtlc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
      await client.connect();
      console.log("Connected");
      const database = client.db('Cars-Server');
      const servicesCollection = database.collection('Cars');
      const purchaseCollection = database.collection('purchases');
      const UsersCollection = database.collection('users');



      app.post('/orders',async(req,res)=>{
           const order=req.body;

           const result=await purchaseCollection.insertOne(order);
res.send(result)
      });
                    // Store Users ///


       app.post('/users',async (req,res)=>{
        const user=req.body;

        const result=await UsersCollection.insertOne(user);

        res.send(result)
       
       })

      //  Update For Google USers///
      app.put('/users',async(req,res)=>{

        const user=req.body;

        const filter = { email:user.email};
        const options = { upsert: true };
        const updateDoc = {$set:user};
      const result= await  UsersCollection.updateOne(filter,updateDoc,options);

       res.send(result)
      })


         //  Delete User Purchase //

         app.delete("/order/:email",async(req,res)=>{
          const id=req.params.email

          const query={_id: Objectid(id)}
          const result = await purchaseCollection.deleteOne(query);
          res.send(result)
          console.log(userEmail);
       })
                


            //  Get User Orders //

            app.get("/order/:email",async(req,res)=>{
               const userEmail=req.params.email;

               const query = {email: userEmail};
               const cursor= purchaseCollection.find(query);
               const result=await cursor.toArray()
               res.json(result);
            })


         
      // Get All USers //

      app.get('/users',async(req,res)=>{

        const cursor =UsersCollection.find({});

          const result=await cursor.toArray()

          res.json(result)
      })
      // GEt All Cars ///
                
         app.get('/cars',async(req,res)=>{
            const cursor=servicesCollection.find({});

            const result=await cursor.toArray()

        res.json(result)
      })

      // get all Orders //

      app.get("/orders",async (req,res)=>{

        const cursor= purchaseCollection.find({});
        const result =await cursor.toArray()
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