var mongoose= require('mongoose');

//User Schema
var PostSchema= mongoose.Schema({
    username: {
        type: String,
        index:true
    },
    text: {
        type:String
    }
});

var Post= module.exports= mongoose.model('Post', PostSchema);

module.exports.createPost= function(newPost, callback) {
    newPost.save(callback);
};

module.exports.getPostsByUsername= function(username,callback) {
    var query= {username:username};
    Post.find(query, function(err,docs) {
        callback(docs);
    });
}
