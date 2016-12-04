var Post= require('../models/post');
var spawn=require('child_process').spawn;
var Busboy = require('busboy');
var fs= require('fs');
var http = require('http'),
    inspect = require('util').inspect;
var stream= require('stream');
var sizeof = require('object-sizeof');
var BufferReader = require('buffer-reader');

function upload(req,callback) {
    var busboy = new Busboy({ headers: req.headers });

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        file.fileRead=[];
        var size=0;
        file.on('data', function(chunk) {
            size+=chunk.length;
            file.fileRead.push(chunk);
        //console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
        });
        file.on('end', function() {
            var data= Buffer.concat(file.fileRead,size);
            pythonCall(data,req,callback,size);
            //console.log('File [' + fieldname + '] Finished');
        });
        file.on('limit', function() {
            console.log("notified");
        });
    });
    busboy.on('finish', function() {
      console.log('Done parsing form!');
    });
    busboy.on('error', function() {
        console.log("got some error");
    })

    req.pipe(busboy);
}

function pythonCall(data,req,callback) {
    //console.log(file.length);
     var opts = {
         stdio: ['pipe', 'pipe', 'pipe','pipe']
     };
     //call python script
    var sp_child= spawn('python',[__dirname+"/../h5main.py",data.length],opts);

    var reader = new BufferReader(data);
    var chunkSize=32192,i=0;
    console.log(data.length);
    console.log("all UPLOADED");
    while(i<data.length)
    {
        if(data.length-i<chunkSize)
        {
            chunk= reader.nextBuffer(data.length-i);
        }
        else{
            // Read next N bytes as buffer
            var chunk = reader.nextBuffer(chunkSize);
        }
        //Initiate the source
        var bufferStream = new stream.PassThrough();

        // Write your buffer
        bufferStream.end(chunk);

        bufferStream.pipe(sp_child.stdio[3],{end: false});

        i+=chunkSize;
    }
    var size=0;
    sp_child.stderr.on('data', function (data) {
      console.log('stderr: ' + data);
    });
    sp_child.stdout.on('data', function (data){
        size+=data.length;
        console.log(size);
        arr=data.toString('utf8');
        var array= JSON.parse(arr); //parse data into JSON form

        var newPost=new Post({
            username:req.user.username,
            jsondata:array
        });
        Post.createPost(newPost, function(err) {
            callback();
            if(err) throw err;
        });
    });
}

function loadPost(user,callback) {
    Post.getPostsByUsername(user.username, function(docs) {
        callback(docs);
    });
}

module.exports ={
    loadPost:loadPost,
    upload:upload
}
