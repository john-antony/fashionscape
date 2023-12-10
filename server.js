
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./mongo.js');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

// Assuming you have a User model and 'SECRET_KEY' is your secret key for JWT

const crypto = require('crypto');

// Generate a secure random string for your secret key
const generateSecretKey = () => {
  return crypto.randomBytes(32).toString('hex');
};

const SECRET_KEY = generateSecretKey();
console.log('Your secret key:', SECRET_KEY); // Replace this with your actual secret key

mongoose.connect('mongodb://127.0.0.1:27017/fashionscape', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Successfully Connected to MongoDB');
}).catch((err) => {
  console.error('Connection to MongoDB failed:', err);
});

app.use(bodyParser.json());
app.use(cors());

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

app.post('/register', async (req, res) => {
    const { email, name, username, password} = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({message: 'User already exists'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ email, name, username, password: hashedPassword});
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully.'});
    }
    catch (error) {
        res.status(500).json({ message: 'Registration failed', error: error.message});
    }
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
