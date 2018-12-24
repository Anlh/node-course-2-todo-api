const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect MongoDB server');
    }
    console.log('Connected to MongoDB server');

    // deleteMany
    // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then(result => {
    //     console.log(result);
    // });

    // deleteOne
    // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then(result => {
    //     console.log(result);
    // });

    // findOneAndDelete
    // db.collection('Todos').findOneAndDelete({completed: false}).then(result => {
    //     console.log(result);
    // });

    // db.collection('Users').deleteMany({text: 'Helder'}).then(result => {
    //     console.log(result);
    // })

    db.collection('Users').findOneAndDelete({_id: new ObjectID('5c1f566a8d2fe5107a0d6358')}).then(result => {
        console.log(result);
    })
});