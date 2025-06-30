const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); 

const app = express();
const PORT = 3000;

let userResults = {}; 

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'typing.html'));
});

app.post('/submit', (req, res) => {
    const { id, wordcount, timestamp, user } = req.body;
    if (!id || typeof wordcount !== 'number' || !timestamp || !user) {
        return res.status(400).json({ error: 'Invalid input' });
    }

    if (!userResults[user]) {
        userResults[user] = [];
    }
    userResults[user].push({ id, wordcount, timestamp });
   res.json({ message: 'Result stored' });
});

app.get('/ranks', (req, res) => {
    let allResults = [];
    for (const user in userResults) {
        userResults[user].forEach(result => {
            allResults.push({ user, wordcount: result.wordcount, timestamp: result.timestamp });
        });
    }

    const sorted = allResults.sort((a, b) => b.wordcount - a.wordcount);
    res.json(sorted);
});


app.get('/leaderboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'leaderboard.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});