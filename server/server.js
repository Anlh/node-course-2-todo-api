require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { mongoose } = require('mongoose');
const { ObjectID } = require('mongodb');

const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const auth = require('./middlewares/auth');

const app = express();
const port = process.env.PORT;

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
});

// Delete route
app.delete('/api/v1/todos/:id', (req, res) => {
    const todoId = req.params.id;

    if (!ObjectID.isValid(todoId)) {
        return res.status(404).send({ message: 'Invalid todo id' });
    }

    Todo.findByIdAndRemove(todoId).then(todo => {
        if (!todo) {
            return res.status(404).send({ message: 'Todo not found' });
        }
        return res.send({ message: 'Todo removed', todo });
    }).catch(err => res.status(400).send(err));
});

// Update route
app.patch('/api/v1/todos/:id', (req, res) => {
    const id = req.params.id,
        body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send({ message: 'Invalid todo id' });
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, { $set: body }, { new: true }).then(todo => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({ todo });
    }).catch(error => res.status(400).send())
});

app.post('/api/v1/users', (req, res) => {
    const user = new User(_.pick(req.body, ['email', 'password']));

    user.save()
        .then(user => {
            return user.generateAuthToken();
        })
        .then(token => {
            res.header('x-auth', token).send(user);
        })
        .catch(err => res.status(400).send(err));
});

app.get('/api/v1/users/me', auth, (req, res) => {
    res.send(req.user);
});


app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = { app };