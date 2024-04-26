const express = require('express');
const cors = require('cors');
const app = express();
const port = 80;
const { SQS } = require('./actions/index');
const { 
  ReceiveMessageCommand,
  DeleteMessageCommand,
  DeleteMessageBatchCommand,
} = require("@aws-sdk/client-sqs")


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  console.log("hi this is the consumer")
    res.send('Hello World! this is the consumer');
});

// i wanna be pending until a message is available in the queue if so, i will consume it, delete it and print it
app.get('/consume', async (req, res) => {
  const sqs = new SQS();
    let message = null;
    let messages = [];
  while (message === null) {
    const isMessageAvailable = await sqs.isMessageAvailable();
      if (isMessageAvailable) {
          messages.push(await sqs.readOneMessage());
      } else { 
          message = "No messages available";
      }
  }
  res.send(messages);
});


app.listen(port, () => {
  console.log(`Server running at ${port} port `);
});
