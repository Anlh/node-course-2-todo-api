const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

const todosFixture = [
    { text: 'First text todo', _id: new ObjectID() },
    { text: 'Second text todo', _id: new ObjectID() }
];

beforeEach((done) => {
    Todo.remove({})
        .then(() => Todo.insertMany(todosFixture))
        .then(() => done());
});

describe('POST /api/v1/todos', () => {
    it('should create a new todo', done => {
        const text = 'Test todo text';

        request(app)
            .post('/api/v1/todos')
            .send({ text })
            .expect(200)
            .expect(res => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find({ text }).then(todos => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch(err => done(err));
            })
    });

    it('should not create todo with invalid body data', done => {
        request(app)
            .post('/api/v1/todos')
            .send({})
            .expect(400)
            .end(err => {
                if (err) {
                    return done(err);
                }

                Todo.find().then(todos => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch(err => done(err));
            })
    });
});

describe('GET /api/v1/todos', () => {
    it('Should get all todos', done => {
        request(app)
            .get('/api/v1/todos')
            .expect(200)
            .expect(res => expect(res.body.todos.length).toBe(2))
            .end(done);
    });
});

describe('GET /api/v1/todos/:id', () => {
    it('Should return todo doc', done => {
        request(app)
            .get(`/api/v1/todos/${todosFixture[0]._id.toHexString()}`)
            .expect(200)
            .expect(res => expect(res.body.todo.text).toBe(todosFixture[0].text))
            .end(done);
    });

    // Exercice: Return 404 if todo not found
    it('Should return 404 if a real todo id not found', done => {
        request(app)
            .get(`/api/v1/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    });

    // Exercice: Invalid id return 404
    it('Should return 404 for non-object ids', done => {
        request(app)
            .get(`/api/v1/todos/123`)
            .expect(404)
            .end(done);
    });
});

describe('DELETE /api/v1/todos/:id', () => {
    it('Should remove a todo', done => {
        const hexId = todosFixture[0]._id.toHexString();
        request(app)
            .delete(`/api/v1/todos/${hexId}`)
            .expect(200)
            .expect(res => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                // query database using findById
                Todo.findById(hexId).then(todo => {
                    expect(todo).toNotExist();
                    done();
                }).catch(err => done(err));
            });
    });

    it('Should return 404 if todo not found', done => {
        request(app)
            .delete(`/api/v1/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('Should return 404 if object id is invalid', done => {
        request(app)
            .delete(`/api/v1/todos/asdads2323`)
            .expect(404)
            .end(done);
    });
});
