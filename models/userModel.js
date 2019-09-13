const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: { type: String },
  email: { type: String },
  course: { type: String },
  phoneno: { type: Number },
  password: { type: String },
  // whenever a user create a new post, we are going to update the user document, and get the post array, add the postId and post. We are going to do that inside the 'then method' in post.js controllers
  posts: [
    {
      postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
      post: { type: String },
      created: { type: Date, default: Date.now() }
    }
  ],
  picVersion: { type: String, default: '' },
  picId: { type: String, default: '' },
  images: [
    {
      imgId: { type: String, default: '' },
      imgVersion: { type: String, default: '' }
    }
  ]
});

module.exports = mongoose.model('User', userSchema);
