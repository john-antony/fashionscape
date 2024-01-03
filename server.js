require('dotenv').config();
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
// const http = require('http');
// const socketIo = require('socket.io');

// Assuming you have a User model and 'SECRET_KEY' is your secret key for JWT

const crypto = require('crypto');

const {OpenAI} = require("openai");
const { OpenAIStream, StreamingTextResponse } = require('ai');


const apiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI({key: apiKey});

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


// const server = http.createServer(app);

// server.listen(3001);

// const io = socketIo.listen(server);

// io.on('connection', (socket) => {
//   console.log('Client connected:', socket.id);

//   socket.on('disconnect', () => {
//     console.log('Client disconnected:', socket.id);
//   });
// });

app.post('/chat-stream', async (req, res) => {
  const { messages } = req.body;

  console.log('Messages:', messages);

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages: [
        {
          role: 'system',
          content:
            'You are a personal stylist bot for the web application Fashionscape. Your tone is that of a snarky, grungy, teenage brat that works in the fashion industry. You only respond to fashion-related questions.',
        }, ...messages
        
      ],
      max_tokens: 200,
    });

    const stream = OpenAIStream(response);

    console.log('Stream:', stream);

    for await (const chunk of stream) {
      res.write(chunk);
      // console.log('chunk:', chunk);
    }

    res.end(); // End the response stream
  } // Send the streaming response directly to the client
   catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/storePosts', async (req, res) => {
  const {imageURL, title, description } = req.body;

  try {
    const newPost = new Post({
      imageURL,
      title,
      description
    });

    const savedPost = await newPost.save();

    // io.emit('newImage', {imageURL, title, description});
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
    // Body: file.buffer,
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
  const {username, password} = req.body;

  try {
    const user = await User.findOne({username});

    if (!user){
      return res.status(404).json({message: 'User does not exist.'});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.status(200).json({email: user.email});
  }
  catch (error) {
    res.status(500).json({ message: 'Error fetching user email', error: error.message});
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

app.post('/addlike', async (req, res) => {
  const {username, imageURL} = req.body;

  try {
    const user = await User.findOne({username});

    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    const isLiked = user.likedImageUrls.includes(imageURL);

    if (isLiked) {
      user.likedImageUrls = user.likedImageUrls.filter((likedImage) => 
      likedImage !== imageURL);

    }
    else {
      user.likedImageUrls.push(imageURL);
    }

    await user.save();

    const post = await Post.findOne({imageURL});

    if (post) {
      post.likes += 1;
      await post.save();
    }

    res.status(200).json({message: 'Likes updates successfully', isLiked: !isLiked})
  }
  catch (error) {
    console.error('Error updating like:', error);
    res.status(500).json({message: 'Internal Service Error'});
  }

  
})

app.get('/likedimages/:username', async (req, res) => {
  const {username} = req.params;

  try {
    const user = await User.findOne({username});

    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    const likedImages = user.likedImageUrls || [];
    res.status(200).json({likedImages});
  }
  catch (error) {
    res.status(500).json({message: 'Internal server error'});
  }
})

app.get('/posts/search', async (req, res) => {
  const {imageURL} = req.query;

  try {

    const indexOfUploads = imageURL.lastIndexOf('/uploads');
    const substring = indexOfUploads !== -1 ? imageURL.substring(indexOfUploads + 9) : null;

    const encodedSubstring = encodeURIComponent(substring);
    
    if (!encodedSubstring) {
      return res.status(400).json({message: 'Invalid imageURL'});
    }

    const post = await Post.findOne({imageURL: { $regex: encodedSubstring }});

    if (!post) {
      return res.status(404).json({message: 'Image post not found'});
    }

    res.status(200).json({post});
  }
  catch (error) {
    console.error('Error fetching image post', error);
    res.status(500).json({message: 'Server error'});
  }
});

app.get('/posts/:postId', async (req, res) => {
  const {postId} = req.params;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({message: 'Post not found'});
    }

    res.status(200).json(post);
  }
  catch (error) {
    console.error('Error fetching post with postId:', error);
    res.status(500).json({message: 'Server error'});
  }
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
