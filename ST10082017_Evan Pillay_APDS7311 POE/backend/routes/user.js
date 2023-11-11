const express = require('express')
const router = express.Router();
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const moment = require('moment');
const ExpressBrute = require('express-brute');

router.post('/signup', (req, res)=>{
    bcrypt.hash(req.body.password,10)
    .then(hash => {
        const user = new User(
            {
                username: req.body.username,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                password: hash
            });
            user.save()
            .then(result => {
                res.status(201).json({
                    message: 'User Created',
                    result: result
                });
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            });
    });
})

const bruteforce = new ExpressBrute(new ExpressBrute.MemoryStore(), {
    freeRetries: 5,
    lifetime: 60, // 1 minute
    minWait: 60 * 1000, // 1 minute
    failCallback: (req, res, next, nextValidRequestDate) => {
      res.status(429).json({
        error: 'Too many login attempts. Try again later.',
        nextValidRequestDate: moment(nextValidRequestDate).format(),
      });
    },
  });

router.post('/login', bruteforce.prevent, async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });

        if (!user) {
            console.error('Authentication failed. User not found.');
            return res.status(401).json({ error: 'Authentication failed' });
        }

        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);

        if (!isPasswordMatch) {
            console.error('Authentication failed. Incorrect password.');
            return res.status(401).json({ error: 'Authentication failed' });
        }

        const token = jwt.sign(
            { username: user.username, userid: user._id },
            'key',
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful', token: token });
    } catch (error) {
        console.error('Error authenticating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router