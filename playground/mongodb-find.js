const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect MongoDB server');
    }
    console.log('Connected to MongoDB server');

    // db.collection('Todos').find({
    //     _id: new ObjectID('5c1f674550ca80239e697ea0')
    // }).toArray()
    //     .then(docs => {
    //         console.log('Todos');
    //         console.log(JSON.stringify(docs, undefined, 2));
    //     }, error => {
    //         console.log('Unable to fetch todos', error);
    //     });

    // db.collection('Todos').find({name}).toArray()
    //     .then(docs => {
    //         console.log(`Todos count:${count}`);
    //     }, error => {
    //         console.log('Unable to fetch todos', error);
    //     });

    db.collection('Users').find({text: 'Helder'}).toArray().then(docs => console.log(JSON.stringify(docs, undefined, 2)), err => console.log(err));

    db.close();
});