const express = require('express')

const cors = require('cors');
require('dotenv').config()
const app = express()
app.use(cors())
app.use(express.json())

const port = 5000


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gdmv2qb.mongodb.net/?retryWrites=true&w=majority`;


console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
  try{
    const appointment=client.db('doctor').collection('treatment');
    app.get('/treatment',async(req,res)=>{
        const query={};
        const option =await appointment.find(query).toArray();
        res.send(option);

    })

  }
  finally{

  }
}
run().catch(console.log);


app.get('/', async(req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Doctor Service listening on port ${port}`)
})