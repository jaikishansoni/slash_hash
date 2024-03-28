const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const path = require('path'); // Import the path module


// Initialize Sequelize with your database credentials
const sequelize = new Sequelize('slash_hash', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});

// Define the model for the Movie table
const Movie = sequelize.define('movie', {
    title: Sequelize.STRING,
    year: Sequelize.STRING,
    type: Sequelize.STRING,
    poster: Sequelize.STRING,
});
// Synchronize the model with the database
sequelize.sync().then(() => {
    console.log('Database synced');
}).catch(err => {
    console.error('Error syncing database:', err);
});

const app = express();

const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle search requests
app.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        const apiKey = '33fffe6e'; // Replace with your OMDB API key

        const response = await axios.get('http://www.omdbapi.com/', {
            params: {
                apikey: apiKey,
                s: query
            }
        });

        res.send(response.data);
    } catch (error) {
        console.error('Error searching for movie/TV show:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

app.use(bodyParser.json());

// Route to save a favorite movie or TV show
app.post('/favorites', async (req, res) => {
    try {
        const { title, year, type, poster } = req.body;

        // Create a new movie record in the database
        await Movie.create({ title, year, type, poster });

        res.status(201).json({ message: 'Favorite saved successfully.' });
    } catch (error) {
        console.error('Error saving favorite:', error.message);
        res.status(500).json({ error: 'An error occurred while saving favorite.' });
    }
});

// Serve index.html for any other route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});