var express = require("express");
var path = require("path");
var app = express();
var HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.use(express.static(__dirname + '/public'));

app.get("/", function(req,res){
    res.sendFile(path.join(__dirname,"/src/index.html"));
});

app.listen(HTTP_PORT, onHttpStart);

