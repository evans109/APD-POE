const express = require('express');
const app = express();
const urlprefix = '/api';
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet'); 
const ExpressBrute = require('express-brute');
const moment = require('moment');
const username = 'admin'
const password = 'admin'

app.use(cors());
app.use(helmet());

const Post = require('./models/post');
const fs = require('fs');
const cert = fs.readFileSync('keys/certificate.pem');
const options = {
  server: { sslCA: cert },
};
const cxnnstring = `mongodb+srv://${username}:${password}@cluster0.1m7zfsx.mongodb.net/?retryWrites=true&w=majority`;

const postRoutes = require('./routes/post');
const userRoutes = require('./routes/user');

mongoose.connect(cxnnstring)
  .then(() => {
    console.log('Connected');
  })
  .catch(() => {
    console.log('Not Connected');
  }, options);

app.use(express.json());
app.use((req, res, next) => {
  if (req.protocol === 'http') {
    const httpsUrl = `https://${req.get('host')}${req.originalUrl}`;
    return res.redirect(httpsUrl);
  }
  next();
});
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', '*');
  next();
});
app.use(urlprefix + '/posts', postRoutes);
app.use(urlprefix + '/users', userRoutes);

// Define the ExpressBrute store and handler
const bruteForce = new ExpressBrute(new ExpressBrute.MemoryStore(), {
  freeRetries: 5,
  lifetime: 60, // 1 minute
  minWait: 60 * 1000, // 1 minute
  failCallback: (req, res, next, nextValidRequestDate) => {
    res.status(429).json({
      error: 'Too many requests. Try again later.',
      nextValidRequestDate: moment(nextValidRequestDate).format(),
    });
  },
});

// Apply the brute force middleware to specific routes as needed
app.post(urlprefix + '/users/signup', bruteForce.prevent, (req, res) => {
  // Your signup route logic here
});

module.exports = app;
