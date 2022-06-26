const express = require('express');
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.smbki.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
   try{
      await client.connect();
      const resultsCollections =client.db('resultsCollection').collection('results');

      app.get('/results', async(req, res) => {
        const query = {};
        const result = await resultsCollections.find(query).toArray();
        res.send(result);
      });
      app.post('/results', async(req, res) => {
        const query = req.body;
        const result = await resultsCollections.insertOne(query);
        res.send(result)
      })
      app.get('/results/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await resultsCollections.findOne(query)
        res.send(result)
      })
      app.put('/results/:id', async(req, res) => {
        const id = req.params.id;
        const data = req.body;
        const query = {_id: ObjectId(id)};
        const options = { upsert: true };
        const updateDoc = {
            $set: {
              name: data.name,
              classLevel: data.classLevel,
              score: data.score
            },
          };
        const result = await resultsCollections.updateOne(query, updateDoc, options);
        res.send(result);
      })
      app.delete('/results/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await resultsCollections.deleteOne(query);
        res.send(result);
      })
   }
   finally{

   }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Server Running')
});

app.listen(port, () => {
    console.log('Server is listening the port', port);
});