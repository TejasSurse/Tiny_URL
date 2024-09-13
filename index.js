require('dotenv').config();
const express = require('express');
const cors = require('cors');
<<<<<<< HEAD
const mongoose = require("mongoose");
const dns = require("node:dns");
const { URL } = require('node:url');
const app = express();

// Connect to MongoDB
async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("DB Not Connected", error);
  }
}

// Call the function to connect
=======
const mongoose = require('mongoose');
const dns = require('node:dns');
const { URL } = require('node:url');
const bodyParser = require('body-parser');

const app = express();

// MongoDB connection
async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.log('DB Not Connected', error);
  }
}

>>>>>>> d3c5aff950138290671349ff7569ba6722151c11
main();

// Basic Configuration
const port = process.env.PORT || 3000;

<<<<<<< HEAD
// Define URL Schema
const URLSchema = new mongoose.Schema({
  original_url: { type: String, required: true, unique: true },
  short_url: { type: String, required: true, unique: true }
});
=======
// URL Schema and Model
const URLSchema = new mongoose.Schema({
  original_url: { type: String, required: true, unique: true },
  short_url: { type: Number, required: true, unique: true }
});

const URLModel = mongoose.model('URL', URLSchema);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
>>>>>>> d3c5aff950138290671349ff7569ba6722151c11

let URLModel = mongoose.model("URLModel", URLSchema);

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(`${process.cwd()}/public`));

<<<<<<< HEAD
// Serve the index.html file
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Route to handle redirection based on short URL
app.get("/api/shorturl/:short_url", (req, res) => {
  let short_url = req.params.short_url;
  URLModel.findOne({ short_url: short_url }).then((foundURL) => {
    if (foundURL) {
      let original_url = foundURL.original_url;
      res.redirect(original_url);
    } else {
      res.json({ message: "The short url does not exist" });
    }
  });
});

// Route to handle URL shortening
app.post('/api/shorturl', async (req, res) => {
  let url = req.body.url;
  // Validate the URL
=======
app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl', async (req, res) => {
  let url = req.body.url;
>>>>>>> d3c5aff950138290671349ff7569ba6722151c11
  try {
    const urlObj = new URL(url);
    dns.lookup(urlObj.hostname, async (err, address) => {
      if (err || !address) {
<<<<<<< HEAD
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

          let newUrl = new URLModel(resObj);
          await newUrl.save();
          res.json(resObj);
        } catch (error) {
          res.json({ error: 'Database error' });
        }
      }
=======
        return res.json({ error: 'invalid url' });
      }

      let lastUrl = await URLModel.findOne({}).sort({ short_url: -1 }).exec();
      let shortUrl = lastUrl ? lastUrl.short_url + 1 : 1;
      const shortUrlStr = shortUrl.toString();

      const newUrl = new URLModel({ original_url: urlObj.href, short_url: shortUrl });
      await newUrl.save();

      res.json({ original_url: urlObj.href, short_url: shortUrl });
>>>>>>> d3c5aff950138290671349ff7569ba6722151c11
    });
  } catch {
    res.json({ error: 'invalid url' });
  }
});

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

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
