const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

//MiddleWare
// app.use(cors());
const corsOptions ={
  origin:'*', 
  credentials:true,
  optionSuccessStatus:200,
}

app.use(cors(corsOptions))
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@technobrandshop.hyfvgpd.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const technologyCollection = client.db("technoDB").collection("products");
    const cartCollection = client.db("technoDB").collection("cart");

    app.get("/products", async (req, res) => {
      const cursor = technologyCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get('/products', async (req, res) => {
      const products = await technologyCollection.find();
      res.send(products);
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await technologyCollection.findOne(query);
      res.send(result);
    });


    app.post("/products", async (req, res) => {
      const product = req.body;
      console.log(product);
      const result = await technologyCollection.insertOne(product);
      res.send(result);
    });
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsart: true };
      const updatedProduct = req.body;
      const products = {
        $set: {
          name: updatedProduct.name,
          brand: updatedProduct.brand,
          type: updatedProduct.type,
          rating: updatedProduct.rating,
          description: updatedProduct.description,
          price: updatedProduct.price,
          image: updatedProduct.image,
        },
      };
      const result = await technologyCollection.updateOne(filter, products, options);
      res.send(result);
    });


    app.get("/cart", async (req, res) => {
      const cursor = cartCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/cart", async (req, res) => {
      const newProducts = req.body;
      console.log(newProducts);
      const result = await cartCollection.insertOne(newProducts);
      res.send(result);
    });

    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });



    // Send a ping to confirm a successful connection
    
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error

    // await client.close();
  }
}
run().catch(console.log);

app.get('/', (req, res) => {
  res.send('Techno & Electro server is running.....')
})
  
  app.listen(port, () => {
    console.log(`Technology Server is running on port: ${port}`);
  });