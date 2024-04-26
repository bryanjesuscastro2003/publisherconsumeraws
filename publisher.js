const express = require('express');
const cors = require('cors');
const app = express();
const port = 80;

app.use(cors());

app.get('/', (req, res) => {
  console.log("hi this is the publisher")
  res.send('Hello World! this is the publisher');
});

app.listen(port, () => {
  console.log(`Server running at ${port} port `);
});
