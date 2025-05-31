const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const PORT = 5000;

app.use(express.json());

const mongourl = 'mongodb://127.0.0.1:27017';
const dbName = 'module4';
let db;

app.get('/', (req, res) => {
    res.send('Hello, Module 4 - Assignment');
});

app.get('/movies', async (req, res) => {
    const moviesList = await db.collection("movies").find().toArray();
    res.send(moviesList);
});

app.get('/movies/:moviename', async (req, res) => {
    const moviename = req.params.moviename;
    const movie = await db.collection("movies").find({name : moviename}).toArray();
    if (!movie) {
      return res.status(404).json({ error: 'Movie name not found' });
    }
    res.send(movie);
});

app.get('/topmovies', async (req, res) => {
    const moviesList = await db.collection("movies").find().sort({ rating: -1 }).limit(3).toArray();
    res.send(moviesList);
});

// update movie details
app.put('/editMovieUpdate', async (req, res) => {
    await db.collection("movies").findOneAndUpdate(
        { name: req.body.name },
        {
            $set: { achievements: "Super Duper Hit" }
        }
    ).then((result) => {
        res.send("Movie updated Successfully");
    })
})

// save movie details
app.put('/editMovieSave', async (req, res) => {
    const movie2 = await db.collection("movies").findOne({ name: req.body.name });
    movie2.achievements = "Super hit";
    await db.collection("movies").replaceOne({ _id: movie2._id }, movie2);
    res.send("Movie saved Successfully");
})

// get super hit and super duper hit movies
app.get('/superhitmovies', async (req, res) => {
    const moviesList = await db.collection("movies").find({
        $or: [
            { achievements: "Super hit" },
            { achievements: "Super Duper Hit" }
        ]
    }).toArray();
    res.send(moviesList);
});


// delete a movie by name
app.delete('/movies/:moviename', async (req, res) => {
    const moviename = req.params.moviename;
    const movie = await db.collection("movies").findOneAndDelete({name : moviename});
    if (!movie) {
      return res.status(404).json({ message: 'Movie name not found' });
    }
    res.send({message: "Movie deleted successfully"});
});

async function connection() {
    const client = new MongoClient(mongourl);
    await client.connect();
    console.log("Mongodb is connected");
    db = client.db(dbName);
}

connection().then(() => {
    app.listen(PORT, () => {
        console.log("Express server listening to PORT", PORT);
    });
});