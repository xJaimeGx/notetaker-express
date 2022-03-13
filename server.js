const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3001;
const userInput = require('./db/db.json');

// code goes here
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static('public'));
app.use(express.json());

// connect front to back
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});
app.get('/api/notes', (req, res) => {
    res.json(userInput.slice(1));
});
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// function to make a new note
function addNote(body, notesArray) {
    const userNote = body;
      if (!Array.isArray(notesArray))
        notesArray = [];

      if (notesArray.length === 0)
        notesArray.push(0);
    body.id = notesArray[0];
    notesArray[0]++;

    notesArray.push(userNote);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notesArray, null, 2)
    );

    return userNote;
};

// add note to json file
app.post('/api/notes', (req, res) => {
    const userNote = addNote(req.body, userInput);
    res.json(userNote);
});

// let user delete note if they want to
function deleteNote(id, notesArray) {
    for (let i = 0; i < notesArray.length; i++) {
        let note = notesArray[i];

        if (note.id == id) {
            notesArray.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(notesArray, null, 2)
            );
            break;

        };
    };
};

app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, userInput);
    res.json(true);
});


app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}`);
});