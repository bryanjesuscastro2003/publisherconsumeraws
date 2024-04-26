const express = require('express');
const cors = require('cors');
const app = express();
const port = 80;
const {SQS} = require('./actions/index');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  console.log("hi this is the publisher")
  res.send('Hello World! this is the publisher');
});

app.get("/getUrlBaseQueue", async (req, res) => {
  const sqs = new SQS();
  const response = await sqs.getQueueUrl();
  res.send(response);
})

app.get('/listqueues', async (req, res) => {
  const sqs = new SQS();
  const response = await sqs.getListQueues();
  res.send(response);
})

app.post('/publish', async (req, res) => {
  const sqs = new SQS();
  // message from the body
  const message = req.body.message;
  const response = await sqs.sendMessage(message);
  res.send(response);
})

app.listen(port, () => {
  console.log(`Server running at ${port} port `);
});
