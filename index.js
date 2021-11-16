const express = require('express');
const {MongoClient} = require('mongodb');
require('dotenv').config()
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middlewire
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y80ik.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// const uri = "mongodb+srv://artistic_glow:de0LB7WwgISieaVB@cluster0.y80ik.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('artistic_glow');
        const userCollection = database.collection('users');
        const prodcutCollection = database.collection('Products');
        const ratingCollection = database.collection('Rating');
        const orderCollection = database.collection('Order');



        app.get('/users', async (req, res) => {
            const cursor = userCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        });
        app.get('/rating', async (req, res) => {
          
            const cursor = ratingCollection.find({});
            const rating = await cursor.toArray();
            res.send(rating);
        });
        app.get('/order', async (req, res) => {
          
            const cursor = orderCollection.find({});
            const rating = await cursor.toArray();
            res.send(rating);
        });
      
        app.get('/order/:id', async (req, res) => {
           const id = req.params.id;
           console.log(id)
            const filter = {_id: ObjectId(id) };
            console.log('filter', filter)
            const  cursor = await orderCollection.findOne(filter);
    //  const order = await cursor.toArray();
     console.log(cursor)
            res.send(cursor);
        });
        app.get('/orders/:email', async (req, res) => {
            const email = req.params.email;
            // const email = JSON.parse(req.params.email)
             console.log('Email Req:', email)
            const filter = {customerEmail : email };
            const  cursor = orderCollection.find(filter);
            const order = await cursor.toArray();
            
             console.log('order:', order)
            res.send(order);
        });
        app.get('/rating/:email', async (req, res) => {
            const email = req.params.email;
             console.log('Email:', email)
            const filter = {userEmail : email };
            const  cursor = ratingCollection.find(filter);
            const rating = await cursor.toArray();
            
             console.log('rating:', rating)
            res.send(rating);
        });
        app.get('/user/:email', async (req, res) => {
           const email = req.params.email;
            const filter = {email : email };
            const  cursor = userCollection.find(filter);
            const users = await cursor.toArray();
            res.send(users);
        });
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const filter = {email : email };
            const  user = await userCollection.findOne(filter);
            let isAdmin = false;
            if (user?.role == 'admin') {
                isAdmin=true
            }

            res.send({admin:isAdmin});
        });


        // product 
          app.get('/products', async (req, res) => {
            const cursor = prodcutCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });
 app.get('/products/:id', async (req, res) => {
           const id = req.params.id;
        //    console.log(id)
            const filter = {_id: ObjectId(id) };
            const  cursor = await prodcutCollection.findOne(filter);
    //  const products = await cursor.toArray();
    //  console.log(cursor)
            res.send(cursor);
        });
 
 app.delete('/products/:id', async (req, res) => {
           const id = req.params.id;
           console.log('Delete Req-', id)
            const filter = {_id :ObjectId(id) };
            const  cursor = await prodcutCollection.deleteOne(filter);
    //  const products = await cursor.toArray();
     console.log('Deleted',cursor)
            res.send(cursor);
        });
 app.delete('/rating/:id', async (req, res) => {
           const id = req.params.id;
           console.log('Delete Req-', id)
            const filter = {_id :ObjectId(id) };
            const  cursor = await ratingCollection.deleteOne(filter);
    //  const products = await cursor.toArray();
     console.log('Deleted',cursor)
            res.send(cursor);
        });
 app.delete('/order/:id', async (req, res) => {
           const id = req.params.id;
           console.log('Delete Req-', id)
            const filter = {_id :ObjectId(id) };
            const  cursor = await orderCollection.deleteOne(filter);
    //  const products = await cursor.toArray();
     console.log('Deleted',cursor)
            res.send(cursor);
        });


    //    post  
        app.post('/users', async (req, res) => {

            const user = req.body;
            const result = await userCollection.insertOne(user)         
            res.json(result);
        })
        app.post('/order', async (req, res) => {

            const order = req.body;
            const result = await orderCollection.insertOne(order)         
            res.json(result);
        })
        app.post('/products', async (req, res) => {

            const product = req.body; 
            const result = await prodcutCollection.insertOne(product)
            res.json(result);
        })
        
        app.put('/rating', async (req, res) => {

            const rating = req.body;
            console.log('rating:', rating)
            const filter = {userEmail : rating.userEmail };
            const options = { upsert: true };
            const updateDoc = {
                $set: rating
            };
            const result = await ratingCollection.updateOne(filter, updateDoc, options);
           console.log('rating re:', result)
            res.json(result);
        })
        app.put('/users', async (req, res) => {

            const user = req.body;
            const filter = {email : user.email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
          
            res.json(result);
        })
        app.put('/users/admin', async (req, res) => {

            const user = req.body;
            console.log(user)
            const filter = {email : user.email };
            const updateDoc = {
                $set: {role:'admin'}
            };
            const result = await userCollection.updateOne(filter, updateDoc);
            console.log(result)
            res.json(result);
        })

// product update 
         app.put('/products/:id',async (req,res)=> {
             const id = req.params.id;
             console.log('update-id', id)
             const updateService = req.body;
             console.log('Body ',updateService)
            const filter = { _id: ObjectId(id) };
            const option = { upsert: true };
            const updateDoc = {
                $set: {
                    productName: updateService.productName,
                    productDescription: updateService.productDescription,
                    productPrice: updateService.productPrice,
                    productImageUrl: updateService.productImageUrl
                },
            };
             const product = await prodcutCollection.updateOne(filter, updateDoc, option);
             console.log(product)
            res.json(product);
        })

 app.put('/order/:id',async (req,res)=> {
     const id = req.params.id;
      console.log('Req Updated id', id)
            const updateOrder = req.body;
            console.log(updateOrder.orderStatus)
            // console.log('Req Updated Detail',updateOrder)
            const filter = { _id: ObjectId(id)};
            // const option = { upsert: false };
            const updateDoc = {
                $set: {
                    orderStatus: updateOrder.orderStatus,
                }
            };
     const result = await orderCollection.updateOne(filter, updateDoc);
     console.log(result)
            res.json(result);
        })

    } finally {
        // await client.close()
    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Running My Server');
})

app.listen(port, () => {
    console.log('Running Server On Port:-', port);
})