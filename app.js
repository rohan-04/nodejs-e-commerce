const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/add-products', (req, res, next) => {
	console.log('Second middleware');
	res.send('<h1>Add Products!!!</h1>');
});

app.use('/', (req, res, next) => {
	console.log('First middleware');
	res.send('<h1>Hello from Express.JS</h1>');
});

// const server = http.createServer(app);
// server.listen(3000);
app.listen(3000);
