// to write to to JSON file
const fs = require('fs');
// to set the HTML paths
const path = require('path');
// to create a random variable
const { v4: uuidv4 } = require('uuid'); 
// to get an instance of express / connect to it
const express = require('express');
const app = express();
// connect to the JSON file (where values are stored)
const data = require('./db/db.json');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');

//localHost port number + Heroku port number
const PORT = process.env.PORT || 3001;

//to enable HTTP requests to be read by express and vice versa
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

//Find the delete the use deleted item
app.delete('/api/notes/:id', (req,res) => {
    //find all but the deleted item
    const idValue = req.params.id;
    const result = data.filter(data => data.id != idValue); 
    //rewrite the entire file again
    try{
        fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(result, null, 2)
        );

        res.json(result);         
    } catch(error){
        res.send("Data was not entered: " + error);
    }     
});
//load the JSON file to notes
app.get('/api/notes', (req, res) => {
    res.json(data);
 });

 //Enter new notes/items
app.post('/api/notes', (req, res) => {
    //enter a unique id
    req.body.id = uuidv4();

    const dataValue = req.body;
    data.push(dataValue);

    //write the update to the JSON file
    try{
        fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(data, null, 2)
        );

        res.json(dataValue);
    } catch(error){
        res.send("Data was not entered: " + error);
    }
});

//Link to the notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});
//link to the index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});
//list to the port
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});