import express from 'express'
import fs from "fs"
import path from "path"

const app = express();
const PORT = 3000;

app.get('/data', (req, res) => {
  const filePath = path.join('./data.json');
  fs.readFile(filePath, (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to read data' });
    res.send(JSON.parse(result));
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});