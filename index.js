const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lb3rxqj.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const toyCollection = client.db("toyPal").collection("toys");

    app.post("/addtoy", async (req, res) => {
      const body = req.body;
      const result = await toyCollection.insertOne(body);
      res.send(result);
    });

    // toys routes
    app.get("/toys", async (req, res) => {
      const result = await toyCollection.find().toArray();
      res.send(result);
    });

    app.get("/toys/:text", async (req, res) => {
      const result = await toyCollection
        .find({
          sub_category: req.params.text,
        })
        .toArray();
      res.send(result);
    });

    app.get("/details/:id", async (req, res) => {
      const result = await toyCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(result);
    });

    app.get("/myToys/:email", async (req, res) => {
      const result = await toyCollection
        .find({
          seller_email: req.params.email,
        })
        .toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("ToyPal is running");
});

app.listen(port, () => {
  console.log(`This is ToyPal Port : ${port}`);
});
