const express = require('express')
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const app = express()
const port =process.env.PORT || 5000
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9yn9k.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// console.log(uri)
app.get('/', (req, res) => {
  res.send('Hello World')
})
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('connection error', err);
  const productCollections = client.db("freshfood").collection("products");
  const orderCollection = client.db("freshfood").collection("orders");

  app.get('/products',(req, res)=>{
    productCollections.find()
    .toArray((err,items)=>{
      res.send(items)
    })
  })
  
  app.get('/product/:_id',(req, res)=>{
    const id = ObjectID(req.params._id);
    productCollections.find({_id:id})
    .toArray((err,items)=>{
      res.send(items)
    })
  })
    app.post('/addProducts',(req,res)=>{
      const newProduct = req.body;
      productCollections.insertOne(newProduct)
      .then(result=>{
        res.send(result.insertedCount > 0)
       
      })
    })

    app.post('/orderProduct',(req,res)=>{
      const newOrder = req.body;
     orderCollection.insertOne(newOrder)
      .then(result=>{
        res.send(result.insertedCount > 0)
       
      })
    })

    app.get('/order',(req, res)=>{
      const email = req.query.email;
      orderCollection.find({email:email})
      .toArray((err,documents)=>{
        res.send(documents)
      })
    })

    app.delete('/deleteItem/:id',(req, res)=>{
       const id = ObjectID(req.params.id);
       productCollections.deleteOne({_id:id})
       .then(documents=>{
        res.send(documents.deletedCount>0)
       })
    })
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})