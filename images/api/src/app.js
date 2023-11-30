const express = require("express");
const app = express();
const bodyParser = require("body-parser")

const knex = require("knex")
const knexConfig = require("./db/knexfile.js")
const db = knex(knexConfig.development)

const {checkItemName} = require("./helpers/endpointHelpers.js");

//line to test database connection
// db.raw("SELECT 1+1").then(d => console.log(d))

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
        if(id >= 0 && typeof(id) == 'number'){
            const searchedItem = await db('items').where({ id }).first();
        
            if (searchedItem) {
                res.json(searchedItem);
            } else {
                res.status(404).json({ error: 'Item not found' });
            }
        } 
        }catch (error) {
          res.status(500).json({ error: 'Error fetching item by ID.' });
        } //add else function for invalid id
});

// POST 
app.post('/saveItem', async (req, res) => {
    try{
        const {id, text}= req.body;
        if (checkItemName(text)) {
            const[itemId]= await db('items').insert({id, text});
            res.json({id:itemId});
        }
        else{
            res.status(400).send({message: 'Item name not formatted correctly'})
        }
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
app.delete('/deleteItem/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      await db('items').where({ id }).del();
  
      res.json({ message: 'Item deleted successfully.' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting item.' });
    }
});

module.exports = app;