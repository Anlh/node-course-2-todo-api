const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

// const id = '5c20ff6bd7feb42445fc5f22';

// if (!ObjectID.isValid(id)) {
//     console.log('ID not valid');
// }

// Todo.find({
//     _id: id
// }).then(todos => {
//     console.log('Todos', todos);
// });

// Todo.findOne({
//     _id: id
// }).then(todo => {
//     console.log('Todos', todo);
// });

// Todo.findById(id).then(todo => {
//     if (!todo) {
//         return console.log('Id not found');
//     }
//     console.log('Todo by id', todo);
// }).catch(err => console.log(e));

// Exercice Fetch user by id
const userId = '5c20ce26730e123728c13e36';

User.findById(userId).then(user => {
    if (!user) {
        return console.log(`${user} not found!`);
    }
    console.log(`User found:${JSON.stringify(user, undefined, 2)}`);
}).catch(err => console.log(err));