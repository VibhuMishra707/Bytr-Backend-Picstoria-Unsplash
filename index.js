const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const { sequelize } = require('./models/index.js');
require('dotenv').config();

const { createNewUser, savePhoto, addPhotoTag, searchPhotosByTag } = require('./controller/dataController.js');
const { searchImages, viewSearchHistory } = require('./controller/serviceController.js');

app.get('/api/photos/search', searchImages);
app.get('/api/photos/tag/search', searchPhotosByTag);
app.get('/api/search-history', viewSearchHistory);

app.post('/api/users',  createNewUser);
app.post('/api/photos', savePhoto);
app.post('/api/photos/:photoId/tags', addPhotoTag);

app.get('/', (req, res) => {
    res.status(200).send('Bytr Picstoria - Unspalash: Excercise 2.4 MS1 Assignment (Working with Microservices)');
});

if (process.env.NODE_ENV !== 'test') {
    sequelize.authenticate().then(() => {
        console.log("Database Connected.");
    }).catch(error => {
        console.error("Unable to connect to database", error);
    });
}

module.exports = { app };