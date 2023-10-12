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

//GET by id
app.get('/:id',(req,res)=>{
    const id = parseInt(req.params.id);
    const item = items.find((a)=> a.id ===id);

    if(item){
        res.json(item);
    } else {
        res.status(404).json({error: "Item not found"});
    }
});

// POST 
app.post('/saveItem', (req, res) => {
    let newItem ={};
    newItem.id = items.length + 1;
    newItem.text = req.body.text;
    items.push(newItem);
    res.status(201).json(newItem);
});

app.listen(port, (err)=> {
    if(!err){
        console.log("running on port " + port);
    }
    else {
        console.error(err)
    }
});