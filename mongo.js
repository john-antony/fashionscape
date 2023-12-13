const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
});

const postSchema = new mongoose.Schema({
    imageURL: {type: String, required: true},
    title: {type: String, required: true},
    description: { type: String}
});

const User = mongoose.model('User', userSchema);

const Post = mongoose.model('Post', postSchema);

module.exports = {User, Post};