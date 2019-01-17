const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');

const userOneId = new ObjectID()
const userTwoId = new ObjectID();
const users = [{
    _id: userOneId,
    email: 'helder@example.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: userOneId, access: 'auth' }, 'abc123').toString()
    }]
}, {
    _id: userTwoId,
    email: 'jen@example.com',
    password: 'userTwoPass'
}];


const todosFixture = [
    { text: 'First text todo', _id: new ObjectID(), completed: false, completedAt: 333 },
    { text: 'Second text todo', _id: new ObjectID() }
];

const populateTodos = (done) => {
    Todo.remove({})
        .then(() => Todo.insertMany(todosFixture))
        .then(() => done());
};

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo])
    }).then(() => done());
};

module.exports = {
    todosFixture,
    populateTodos,
    users,
    populateUsers
};