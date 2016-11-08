var Post= require('../models/post');

function addPost(postData,user) {
    var newPost=new Post({
        username:user.username,
        text:postData.text
    });
    console.log({
        username:user.username,
        text:postData.text
    });
    Post.createPost(newPost, function(err) {
        if(err) throw err;
    });
}

function loadPost(user,callback) {
    Post.getPostsByUsername(user.username, function(docs) {
        callback(docs);
    });
}

module.exports ={
    loadPost:loadPost,
    addPost:addPost
}
