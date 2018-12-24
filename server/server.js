const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');


const app = express();
app.use(bodyParser.json());

app.post('/api/v1/todos', (req, res) => {
    console.log(req.body);
    res.send('Success');
});

app.listen(3000, () => {
   console.log('Started on port 3000'); 
});