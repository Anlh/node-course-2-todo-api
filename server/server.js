const express = require('express');
const bodyParser = require('body-parser');
const { mongoose } = require('mongoose');
const { ObjectID } = require('mongodb');

const { Todo } = require('./models/todo');
const { User } = require('./models/user');


const app = express();
app.use(bodyParser.json());

app.post('/api/v1/todos', (req, res) => {
    const todo = new Todo({
        text: req.body.text
    });

    todo.save().then(
        doc => res.send(doc),
        err => res.status(400).send(err)
    );
});

app.get('/api/v1/todos', (req, res) => {
    Todo.find().then(todos => res.send({ todos })),
        err => res.status(400).send(err);
});

// Exercice fetching an individual todo item
app.get('/api/v1/todos/:id', (req, res) => {
    const todoId = req.params.id;

    if (!ObjectID.isValid(todoId)) {
        return res.status(404).send()
    }

    Todo.findById(todoId).then(todo => {
        if (!todo) {
            return res.status(404).send();
        }
        return res.send({ message: 'Todo found', todo });
    }).catch(err => res.status(404).send());
})

app.listen(3000, () => {
    console.log('Started on port 3000');
});

module.exports = { app };