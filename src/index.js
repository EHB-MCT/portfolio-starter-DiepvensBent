const express = require("express");
const app = express();
const bodyParser = require("body-parser")
const port = 3000;

const knex = require("knex")
const knexConfig = require("../src/db/knexfile.js")
const db = knex(knexConfig.development)

db.raw("SELECT 1+1").then(d => console.log(d))

app.use(bodyParser.json());

//GET
app.get("/", async (req,res)=>{
    const results = await db.select("*").table("items")
    res.json(results)
});

//GET by id
app.get('/:id',async(req,res)=>{
    try{

        const { id } = req.params;

        const searchedItem = await db('items').where({ id }).first();
        
        if (searchedItem) {
            res.json(searchedItem);
          } else {
            res.status(404).json({ error: 'Item not found' });
          }
        } catch (error) {
          res.status(500).json({ error: 'Error fetching item by ID.' });
        }
});

// POST 
app.post('/saveItem', async (req, res) => {
    try{
        const {id, text}= req.body;
        const[itemId]= await db('items').insert({id, text});
        res.json({id:itemId});
    }catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating item' });
      }
});

//PUT
app.put('/changeItem/:id', async(req,res)=>{
    try{
        const { text } = req.body;
        const { id } = req.params;

        await db('items').where({ id }).update({
            text
        });
        res.json({id});    
    } catch(error){
        res.status(500).json({ error: 'Error updating item.' });
    }
});

//DELETE
app.delete('/deleteItem/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = items.findIndex((a) => a.id === id);
  
    if (index !== -1) {
      const deletedItem = items.splice(index, 1)[0];
      res.json(deletedItem);
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  });




//DELETE
app.delete('/deleteItem/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = items.findIndex((a) => a.id === id);
  
    if (index !== -1) {
      const deletedItem = items.splice(index, 1)[0];
      res.json(deletedItem);
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  });

app.listen(port, (err)=> {
    if(!err){
        console.log("running on port " + port);
    }
    else {
        console.error(err)
    }
});