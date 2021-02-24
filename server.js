const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');  //added
const express = require('express');
const data = require('./db/db.json');
const {v4: uuidv4} = require('uuid');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.delete('/api/notes/:id', (req,res) => {
    const idValue = req.params.id;
    const result = data.filter(data => data.id != idValue); 

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

app.get('/api/notes', (req, res) => {
    res.json(data);
 });

app.post('/api/notes', (req, res) => {
    req.body.id = uuidv4();

    const dataValue = req.body;
    data.push(dataValue);

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

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
    console.log(uuidv4());        //added
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});