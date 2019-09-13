const mongoose = require('mongoose');

//create schema
const postSchema = mongoose.Schema({
//add the id of the user.
    //It will save the auto-generated id of the user and make reference to the user collection. So that once it's saved, we can populate the id with the user data
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    username: { type: String, default: '' },
    post: { type: String, default: '' },
    comments: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
        username: { type: String, default: '' },
        comment: { type: String, default: '' },
        //created property
        createdAt: {type: Date, default: Date.now()}
    }],
    //Now we'll create the total Likes that each comment will have.
    totalLikes: { type: Number, default: 0 },
    likes: [
        {
            username: { type: String, default: '' }
        }
    ],
    created: {type: Date, default: Date.now()} 
});

module.exports = mongoose.model('Post', postSchema);