const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');


// Todo.remove({}).then(result => console.log(result));

// Todo.findOneAndRemove
// Todo.findByIdAndRemove

Todo.findByIdAndRemove('5c352e890c5153e2466382d9').then((todo) => {
    console.log(todo);
});