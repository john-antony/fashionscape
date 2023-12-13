
const {generateUploadURL, fetchDataFromS3, uploadToS3, s3} = require('./s3.js');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const {User, Post} = require('./mongo.js');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const multer = require('multer');
const uuid = require('uuid');

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


const upload = multer({dest: 'uploads/'});

app.post('/storePosts', async (req, res) => {
  const {imageURL, title, description } = req.body;

  try {
    const newPost = new Post({
      imageURL,
      title,
      description
    });

    const savedPost = await newPost.save();
    res.json({message: 'Post information stored successfully!', post: savedPost});
  }
  catch (error){
    console.error('Error storing post', error);
    res.status(500).json({error: 'Error storing post'});

  }
});

app.post('/uploadToS3', upload.single('file'), async (req, res) => {
  const file = req.file;

  const key = `uploads/${uuid.v4()}_${file.originalname}`;

  const params = {
    Bucket: "fashionscape-user-upload",
    Key: key,
    Body: require('fs').createReadStream(file.path),
    ContentType: file.mimetype
  };
  try {
    const data = await s3.upload(params).promise(); // Use promise() to convert upload to a promise

    res.json({ url: data.Location });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error uploading to S3' });
  };

});

// app.get('/s3Url', async (req, res) => {
//   const { title, description } = req.query; // Extract title and description from query params 
//   const url = await generateUploadURL({title, description});
//   res.send({url});
// })

app.get('/images', async (req, res) => {
  try {
    const params = {
      Bucket: 'fashionscape-user-upload',
      Prefix: 'uploads/'
    };

    const data = await s3.listObjectsV2(params).promise();

    const images = data.Contents.map(obj => {
      return {
        imageURL: `https://${params.Bucket}.s3.amazonaws.com/${obj.Key}`,
      };
    });
    res.json(images);
  }
  catch (error) {
    console.error('Error fetching images from S3: ', error);
    res.status(500).json({error: 'Failed to fetch images'});
  }
});
  

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
