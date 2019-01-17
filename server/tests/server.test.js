const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');
const { todosFixture, populateTodos, users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

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

describe('PATCH /api/v1/todos/:id', () => {
    it('Should update the todo', done => {
        const hexId = todosFixture[0]._id.toHexString();
        const text = 'This should be the new text';

        request(app)
            .patch(`/api/v1/todos/${hexId}`)
            .send({
                completed: true,
                text
            })
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end(done);
    });

    it('Should clear completedAt when todo is not completed', done => {
        const hexId = todosFixture[1]._id.toHexString();
        const text = 'This should be the new text!!!';

        request(app)
            .patch(`/api/v1/todos/${hexId}`)
            .send({
                completed: false,
                text
            })
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist();
            })
            .end(done);
    });
});

describe('GET /api/v1/users/me', () => {
    it('should return user if authenticated', done => {
        const user = users[0];
        request(app)
            .get('/api/v1/users/me')
            .set('x-auth', user.tokens[0].token)
            .expect(200)
            .end(done);
    });

    it('should return 401 if not authenticated', done => {
        const user = users[1];
        request(app)
            .get('/api/v1/users/me')
            .expect(401)
            .end(done);
    });
});

describe('POST /api/v1/users', () => {
    it('Should create a user', done => {
        const email = 'exampletest@example.com';
        request(app)
            .post('/api/v1/users')
            .send({ email: email, password: 'xptooo' })
            .expect(200)
            .expect(res => {
                expect(res.headers['x-auth']).toExist()
                expect(res.body._id).toExist()
                expect(res.body.email).toBe(email)
            })
            .end(err => {
                if (err) {
                    return done(err);
                }
            })
            done()
    });

    it('should return validation errors if request invalid', done => {
        request(app)
            .post('/api/v1/users')
            .expect(400)
            .end(done)
    });

    it('Should not create user if email in use', done => {
        const { password, email } = users[1];
        request(app)
            .post('/api/v1/users')
            .send({ email, password })
            .expect(400)
            .end(done)
    });
})