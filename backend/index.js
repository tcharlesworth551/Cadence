const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Cadence API is running' });
});

app.listen(PORT, () => {
  console.log(`Cadence backend running on port ${PORT}`);
});