const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect MongoDB server');
    }
    console.log('Connected to MongoDB server');

    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('5c1f67d2d5a834c20202197d')
    // }, {
    //     $set: {
    //         completed: false
    //     }
    // }, {
    //     returnOriginal: false
    // }).then(result => console.log(result));

    // Exercice
    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5c20c1908b0a16e543a2cbdc')
    }, {
        $set: {
            name: 'Isabel'
        },
        $inc: {age: -1}
    }, {
        returnOriginal: false
    }).then(result => console.log(result));
});