const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const { sequelize } = require('./models/index.js');
require('dotenv').config();

const { createNewUser } = require('./controller/datacontroller.js');
const { searchImages } = require('./controller/serviceController.js');


app.post('/api/users',  createNewUser);
app.get('/api/photos/search', searchImages);

app.get('/', (req, res) => {
    res.status(200).send('Bytr Picstoria - Unspalash: Excercise 2.4 MS1 Assignment (Working with Microservices)');
});


sequelize.authenticate().then(() => {
    console.log("Database Connected.");
}).catch(error => {
    console.error("Unable to connect to database", error);
});

module.exports = { app }

/*
const query = req.query;
const queryVaIidation = validateSearchImagesQueryParam(query) ;
if (queryVa1idation.length > 0) {
    return res.status(400) .json({ error: queryVa1idation });
}
*/