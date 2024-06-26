const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 5000;

const malikLog = [{}];

const server = http.createServer(app);

const io = socketIO(server);

io.on('connection', socket => {
  console.log('new connection');

  socket.on('joined', ({ malik }) => {
    malikLog[socket.id] = malik;
    console.log(`${malik} has joined`);
    socket.broadcast.emit('userJoined', {
      malik: 'Admin',
      message: `${malikLog[socket.id]} has joined`,
    });


    socket.emit('welcome', {
      malik: 'Admin',
      message: `Welcome to the chat, ${malikLog[socket.id]}`,
    });
  });

  socket.on('message', ({message, id}) => {
  io.emit(`sendMessage`, {malik: malikLog[id], message, id})
})

  socket.on('disconnect', () => {
    socket.broadcast.emit('leave', {
      malik: 'Admin',
      message: ` ${malikLog[socket.id]} has left the chat`,
    });
    console.log(`User left`);
  });
});

// middleware
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5000'],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    optionsSuccessStatus: 204,
    exposedHeaders: ['Access-Control-Allow-Headers'],
  })
);
app.use(express.json());
app.use(cookieParser());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eted0lc.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});


async function run() {
  try {
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('chatting is on');
});

server.listen(port, () => {
  console.log(`Port is running on: ${port}`);
});
