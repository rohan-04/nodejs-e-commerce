const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

// const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');

const errorController = require('./controllers/error');

// Database connection
const mongoConnect = require('./util/database');

const app = express();

// app.set() sets global value which can be use in our whole app
// Sets the template engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// For parsing incoming request
app.use(express.urlencoded({ extended: false }));

// For serving static files i.e CSS files or images or javascript, etc
//  __dirname gives path till current file in pc
app.use(express.static(path.join(__dirname, 'public')));

// Accessing current user
app.use((req, res, next) => {
	// User.findByPk(1)
	// 	.then((user) => {
	// 		req.user = user;
	// 		next();
	// 	})
	// 	.catch((err) => console.log(err));
});

// // Defining Routes
// app.use('/admin', adminRoutes);
// app.use('/', shopRoutes);

// 404 Page
// path is not given then by default it takes home route i.e '/'
app.use(errorController.get404);

mongoConnect((client) => {
	console.log(client);
	app.listen(3000);
});
