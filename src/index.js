const express = require("express");
const app = express();
const bodyParser = require("body-parser")
const port = 3000;

//Data
let items = [
    {id:1,text: "Test"},
    {id:2,text: "Hello"},
]

app.use(bodyParser.json());

//GET
app.get("/", (req,res)=>{
    res.json(items)
});

app.listen(port, (err)=> {
    if(!err){
        console.log("running on port " + port);
    }
    else {
        console.error(err)
    }
});