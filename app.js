const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

// For parsing incoming request
app.use(bodyParser.urlencoded({ extended: false }));

// For serving static files i.e CSS files or images, etc
app.use(express.static(path.join(__dirname, 'public')));

// Defining Routes
app.use('/admin', adminRoutes);
app.use('/', shopRoutes);

app.use('/', (req, res, next) => {
	res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

// const server = http.createServer(app);
// server.listen(3000);
app.listen(3000);
