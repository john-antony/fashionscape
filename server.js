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

mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
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

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'https://fashionscape.onrender.com',
    methods: ['GET', 'POST'],
  },
});
// const server = http.createServer(app);

// server.listen(3001);

// const io = socketIo.listen(server);

// io.on('connection', (socket) => {
//   console.log('Client connected:', socket.id);

//   socket.on('disconnect', () => {
//     console.log('Client disconnected:', socket.id);
//   });
// });

const extractIdFromImageUrl = (imageURL) => {
  const indexOfUploads = imageURL.lastIndexOf('/uploads');
  const substring = indexOfUploads !== -1 ? imageURL.substring(indexOfUploads + 9) : null;

  // Extract the first 36 characters after '/uploads'
  return substring ? substring.slice(0, 36) : null;
};

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
  const {imageURL, username, title, description } = req.body;

  try {
    const newPost = new Post({
      imageURL,
      username,
      title,
      description
    });

    const savedPost = await newPost.save();

    await User.findOneAndUpdate(
      { username }, // Find the user by their username
      { $push: { createdPostUrls: imageURL } }, // Add the imageURL to createdPostUrls array
      { new: true } // To get the updated document
    );

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
    Bucket: process.env.AWS_S3_BUCKET_NAME,
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

app.get('/images', async (req, res) => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Prefix: 'uploads/'
    };

    const data = await s3.listObjectsV2(params).promise();

    const images = data.Contents.map(obj => {
      return {
        imageURL: `https://${params.Bucket}.s3.amazonaws.com/${obj.Key}`,
      };
    });
    io.emit('imagesUpdated', images);
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

  // Extract the first 36 characters after '/uploads'
  const charactersToSearch = extractIdFromImageUrl(imageURL);

  if (!charactersToSearch) {
    return res.status(400).json({ message: 'Invalid imageURL' });
  }

  try {
    const user = await User.findOne({username});
    const post = await Post.findOne({ imageURL: { $regex: charactersToSearch } });

    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    const isLiked = user.likedImageUrls.includes(imageURL);

    if (isLiked) {
      user.likedImageUrls = user.likedImageUrls.filter((likedImage) => 
      likedImage !== imageURL);
      post.likes = post.likes.filter((likes) => likes !== username);

    }
    else {
      user.likedImageUrls.push(imageURL);
      post.likes.push(username);
    }

    await user.save();
    await post.save();

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

app.get('/createdposts/:username', async (req, res) => {
  const {username} = req.params;

  try {
    const user = await User.findOne({username});

    if (!user) {
      return res.status(404).json({message: 'Could not find User.'});
    }

    const createdPosts = user.createdPostUrls || [];
    res.status(200).json({createdPosts});
  }
  catch (error) {
    console.error('Error fetching created posts:', error);
    res.status(500).json({message: 'Internal server error.'});
  }
})

app.get('/posts/search', async (req, res) => {
  const {imageURL} = req.query;

  try {

    // Extract the first 36 characters after '/uploads'
    const charactersToSearch = extractIdFromImageUrl(imageURL);

    if (!charactersToSearch) {
      return res.status(400).json({ message: 'Invalid imageURL' });
    }

    const post = await Post.findOne({ imageURL: { $regex: charactersToSearch } });

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

app.delete('/deletePost/:postId', async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({message: 'Post to delete not found.'});
    }

    await Post.findByIdAndDelete(postId);

    res.status(200).json({message: 'Post successfully deleted.'});
  }
  catch (error) {
    console.error('Error deleting post with postId:', error);
    res.status(500).json({message: 'Server Error.'});
  }
});

app.patch('/deleteCreatedUrl/:username', async (req, res) => {
  const { username } = req.params;
  const { imageURL } = req.body;

  try {
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    // Extract the 36-character ID from the imageURL
    const charactersToSearch = extractIdFromImageUrl(imageURL);

    if (!charactersToSearch) {
      return res.status(400).json({ message: 'Invalid imageURL' });
    }

    user.createdPostUrls = user.createdPostUrls.filter((url) => {
      const urlId = extractIdFromImageUrl(url);
      return urlId !== charactersToSearch;
    });

    await user.save();

    return res.status(200).json({ message: 'URL deleted from createdPostUrls' });
  }
  catch (error) {
    console.error('Error deleting URL from createdpostUrls', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.patch('/posts/removelike', async (req, res) => {
  const { imageURL } = req.body;

  try {
    const users = await User.find({});

    // Extract the 36-character ID from the imageURL
    const charactersToSearch = extractIdFromImageUrl(imageURL);

    if (!charactersToSearch) {
      return res.status(400).json({ message: 'Invalid imageURL' });
    }

    // Loop through each user and filter out the matching imageURL
    await Promise.all(
      users.map(async (user) => {
        user.likedImageUrls = user.likedImageUrls.filter((url) => {
          const urlId = extractIdFromImageUrl(url);
          return urlId !== charactersToSearch;
        });
        await user.save();
      })
    );

    return res.status(200).json({ message: 'Post removed from users likedImageUrls' });
  } catch (error) {
    console.error('Error removing post from users likedimageurls:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


app.delete('/deleteS3Object', async (req, res) => {
  const { imageURL } = req.body;

  console.log('imageURL:', imageURL);

  const imageId = extractIdFromImageUrl(imageURL);

  if (!imageId) {
    return res.status(400).json({ message: 'Invalid imageURL' });
  }

  try {
    // console.log('Attempting to list objects in S3 bucket...');
    const s3ListResponse = await s3.listObjectsV2({ Bucket: process.env.AWS_S3_BUCKET_NAME }).promise();
    // console.log('S3 listObjectsV2 response:', s3ListResponse);

    // find and delete the s3 object matching the extracted ID
    const objectToDelete = s3ListResponse.Contents.find(
      (obj) => obj.Key.startsWith(`uploads/${imageId}`)
    );

    if (objectToDelete) {
      console.log('Object found for deletion:', objectToDelete);

      const deleteParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: objectToDelete.Key,
      };
      console.log('Attempting to delete object from S3...');
      await s3.deleteObject(deleteParams).promise();
      console.log('Object deleted successfully.');
      
      return res.status(200).json({ message: 'S3 object deleted successfully.' });
    }

    console.log('Object not found for deletion.');
    return res.status(404).json({ message: 'S3 Object not found for the given ID' });
  } catch (error) {
    console.error('Error deleting S3 object:', error);
    return res.status(500).json({ message: 'Error deleting S3 object.' });
  }
});

app.get('/userSearch', async (req, res) => {
  const { search } = req.query;
  try {
    const users = await User.find({
      $or: [
        { username: {$regex: search, $options: 'i'} },
        // add more fields for search if necessary
      ],
    });

    res.status(200).json(users);
  }
  catch (error) {
    console.error('User search error:', error);
    res.status(500).json({error: 'Error searching users.'});
  }

});

app.get('/postSearch', async (req, res) => {
  const { search } = req.query;

  try {
    const posts = await Post.find({
      $or: [
        { title: {$regex: search, $options: 'i'} },
        { description: {$regex: search, $options: 'i'} },
        // add more fields
      ],
    });

    res.status(200).json(posts);
  }
  catch (error) {
    console.error('Post search error:', error);
    res.status(500).json({error: 'Error searching posts'});
  }

});


server.listen(3001, () => {
    console.log('Server is running on port 3001');
});
