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
        const id = parseInt(req.params.id);
        
        if(id >= 0 && Number.isInteger(id) && id < 9999999999){
            //lookup max int postgres int primary key
            const searchedItem = await db('items').where('id',id).first();
        
            if (searchedItem) {
                res.json(searchedItem);
            } else {
                res.status(404).json({ error: 'Item not found' });
            }
        } 
        else {
            res.status(400).json({message: "invalid id"})
        }
    }catch (error) {
        res.status(500).json({ error: 'Error fetching item by ID.' });
    } //add else function for invalid id
});

// POST 
app.post('/saveItem', async (req, res) => {
    try{
        const {itemName, location_uuid}= req.body;
        if (checkItemName(itemName)) {
            const itemId= await db('items').insert({itemName: itemName, location_uuid}).returning("*");
            res.json(itemId);
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
        const { itemName } = req.body;
        const { id } = req.params;

        const existingItem = await db('items').select('id').where('id', id);
        if (!itemName) {
            return res.status(400).json({ error: 'itemName is required in the request body.' });
        }

        if (!existingItem || existingItem.length === 0) {
            return res.status(404).json({ error: 'Item not found.' });
        }
        if (checkItemName(itemName)) {
            await db('items').where({ id }).update({itemName});
            res.json({id: +id});  //+id to convert id to int  
        } else{
            res.status(400).send({message: 'Item name not formatted correctly'})
        }
    } catch(error){
        res.status(500).json({ error: 'Error updating item.' });
    }
});

//DELETE
app.delete('/deleteItem/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        if (id>=0 && Number.isInteger(id) && id < 9999999999) {
            const existingItem = await db('items').select('id').where('id', id);
            if (!existingItem || existingItem.length === 0) {
                return res.status(404).json({ error: 'Item not found.' });
            }

            await db('items').where({ id }).del();
  
            res.json({ message: 'Item deleted successfully.' });
            
        } else {
            res.status(400).json({message: "invalid id"})
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting item.' });
    }     
    });

module.exports = app;