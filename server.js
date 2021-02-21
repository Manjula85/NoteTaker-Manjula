const fs = require('fs');
const path = require('path');
const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();
const apiNotes = require('./public/assets/js/index');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

//to get the Json
app.use('/api', apiNotes);

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});