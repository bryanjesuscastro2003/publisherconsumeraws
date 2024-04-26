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
  while (message === null) {
    const isMessageAvailable = await sqs.isMessageAvailable();
    if (isMessageAvailable) {
      const queueUrl = await sqs.getQueueUrl();
      const command = new ReceiveMessageCommand({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 1,
      });
      const response = await client.send(command);
      message = response.Messages[0];
      console.log(message);
      const deleteCommand = new DeleteMessageCommand({
        QueueUrl: queueUrl,
        ReceiptHandle: message.ReceiptHandle,
      });
      await client.send(deleteCommand);
    }
  }
  res.send(message);
});


app.listen(port, () => {
  console.log(`Server running at ${port} port `);
});
