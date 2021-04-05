const express = require('express');

const app = express();

// "/users"
app.use('/users', (req, res, next) => {
	console.log('First middleware');
	res.send('<h1>Users route!!!</h1>');
});

// "/"
app.use('/', (req, res, next) => {
	console.log('Second middleware');
	res.send('<h1>Home Route 😎</h1>');
});

app.listen(3001);
