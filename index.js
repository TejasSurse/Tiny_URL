require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dns = require('node:dns');
const { URL } = require('node:url');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.log('DB Not Connected', error);
  }
}

main();

// Define URL Schema and Model
const URLSchema = new mongoose.Schema({
  original_url: { type: String, required: true, unique: true },
  short_url: { type: String, required: true, unique: true } // Corrected type
});

const URLModel = mongoose.model('URLModel', URLSchema);

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static(`${process.cwd()}/public`));

// Serve the index.html file
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Route to handle redirection based on short URL
app.get('/api/shorturl/:short_url', async (req, res) => {
  const short_url = req.params.short_url;
  try {
    const foundURL = await URLModel.findOne({ short_url: short_url }).exec();
    if (foundURL) {
      res.redirect(foundURL.original_url);
    } else {
      res.json({ message: 'The short URL does not exist!' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to handle URL shortening
app.post('/api/shorturl', async (req, res) => {
  const url = req.body.url;
  // Validate the URL
  try {
    const urlObj = new URL(url);
    dns.lookup(urlObj.hostname, async (err, address) => {
      if (err || !address) {
        res.json({ error: 'invalid url' });
      } else {
        try {
          // Generate a short URL
          const count = await URLModel.countDocuments();
          const shortUrl = (count + 1).toString();
          const original_url = urlObj.href;
          const resObj = {
            original_url: original_url,
            short_url: shortUrl
          };

          const newUrl = new URLModel(resObj);
          await newUrl.save();
          res.json(resObj);
        } catch (error) {
          res.json({ error: 'Database error' });
        }
      }
    });
  } catch {
    res.json({ error: 'invalid url' });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
