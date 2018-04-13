const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const mv = require('mv');
const fs = require('fs');
const mime = require('mime');
const path = require('path')
const mysql = require('mysql');

// Create connection
const db = mysql.createConnection({
    host     : 'db.server.com',
    user     : 'root',
    password : 'toor',
    database : 'upload_file'
});

// Connect
db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('MySql Connected...');
});

var app = express();

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use(fileUpload());

//////////To Upload a file /////////////////
app.post('/upload', function(req, res) {
    console.log(req.files);
    let name = req.files;
    let imgy = name.files['name'];
    if (!imgy){
     return res.status(400).send('No files were uploaded.');
    }else{
      //var file = __dirname + '/' + imgy;
      var uploadpath = __dirname + '/uploads/'+ imgy;
      fs.writeFile(uploadpath, "tt", function (err) {
          if (err) {
              return console.log(err);
          }
          console.log("The file was saved!");
      });
      let post = {title:imgy};
      let sql = 'INSERT INTO img_name SET ?';
      let query = db.query(sql, post, (err, result) => {
          if(err) throw err;
          console.log(result);
          res.send('image inserted to db');
      });
     }
});

//////////To Download a file /////////////////
app.get('/download/:id', function(req, res){

  var file = __dirname + '/uploads' + '/' + req.params.id;

  var filename = path.basename(file);
  var mimetype = mime.lookup(file);
  //console.log(mimetype);
  res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  res.setHeader('Content-type', mimetype);

  var filestream = fs.createReadStream(file);
  filestream.pipe(res);
  console.log('Downloaded the file : ' + filename);
});

//////////To Delete a file /////////////////
app.get('/delete/:id', function(req, res){
  let img_name = req.params.id;
  let del_img = __dirname + '/uploads/' + req.params.id
    fs.unlink(del_img, function(error) {
        if (error) {
            throw error;
        }
        let post = {title:img_name};
        let sql = 'DELETE FROM img_name WHERE ?';
        let query = db.query(sql, post, (err, result) => {
            if(err) throw err;
            console.log(result);
            res.send('File deleted from db/disk');
        });
        //console.log('Deleted the file : ' + del_img);
    });
});
app.listen('3000', () => {
    console.log('Server started on port 3000');
});
