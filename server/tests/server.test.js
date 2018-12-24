const expect = require('expect');
const request = require('supertest');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

const todosFixture = [
    { text: 'First text todo' },
    { text: 'Second text todo' }
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
