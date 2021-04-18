const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const errorController = require('./controllers/error');
// Database connection
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');

const app = express();

// app.set() sets global value which can be use in our whole app
app.set('view engine', 'ejs');
app.set('views', 'views');

// For parsing incoming request
app.use(express.urlencoded({ extended: false }));

// For serving static files i.e CSS files or images or javascript, etc
//  __dirname gives path till current file in pc
app.use(express.static(path.join(__dirname, 'public')));

// Defining Routes
app.use('/admin', adminRoutes);
app.use('/', shopRoutes);

// 404 Page
// path is not given then by default it takes home route i.e '/'
app.use(errorController.get404);

// Association
// For onDelete if user is deleted then associated product will also be deleted
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

// Converting the sequelize models define in app to mysql tables in DB
sequelize
	.sync({ force: true })
	.then((result) => {
		// console.log(result);

		// const server = http.createServer(app);
		// server.listen(3000);
		app.listen(3000);
	})
	.catch((err) => {
		console.log(err);
	});
