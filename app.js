const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('<h1>Hello DevOps — Built by Jenkins & Docker!</h1>');
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});