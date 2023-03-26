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
    const book=client.db('doctor').collection('booked');
    const UserBook=client.db('doctor').collection('user');
    app.get('/treatment',async(req,res)=>{
      const datee=req.query.datee;
      console.log(datee);
        const query={};
        const option =await appointment.find(query).toArray();
        const bookingQuery= { appointDate:datee}
        const alreadyBook=await book.find(bookingQuery).toArray();
        option.forEach(open=>{
          const optionBooked=alreadyBook.filter(book=>book.treatment===open.name);
          const bookSlot=optionBooked.map(booki=>booki.slot);
          const remaining= open.slots.filter(slot=>!bookSlot.includes(slot));
          open.slots=remaining;
          console.log(datee,open.name,remaining.length)
        })
        res.send(option);

    });

    app.get('/booked',async(req,res)=>{
      const email=req.query.email;
      console.log(email);
      const query={
        email:email
      }
      const bookings=await book.find(query).toArray();
      res.send(bookings);
    })

    app.post('/booked',async(req,res)=>{
      const booking=req.body;
      console.log(booking);
      const query={
        appointDate:booking.appointDate,
        treatment:booking.treatment,
        email:booking.email

      }
      const alredy=await book.find(query).toArray();
      if(alredy.length){
        const message=`You have already booking on ${booking.appointDate}`;
        return res.send({acknowledged:false,message})
      }
      const result =await book.insertOne(booking);
      res.send(result);
    });

    app.post('/users',async(req,res)=>{
      const user=req.body;
      const result=await UserBook.insertOne(user);
      res.send(result);
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