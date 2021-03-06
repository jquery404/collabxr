/* lr map by @jquery404(faisal) */

const express = require('express');
const app = express();

// middlewares
app.use(express.static(__dirname));

// routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// routes
app.get('/dataviz', (req, res) => {
    res.sendFile(__dirname + '/dataviz/index.html');
});

// routes
app.get('/jigsaw', (req, res) => {
    res.sendFile(__dirname + '/test.html');
});

// routes
app.get('/draw', (req, res) => {
    res.sendFile(__dirname + '/draw/index.html');
});

// port
server = app.listen(process.env.PORT || 3000);
