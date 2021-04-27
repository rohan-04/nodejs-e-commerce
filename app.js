const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI =
	'mongodb+srv://rohan:FGPpGSMKkkesMw81@cluster0.g5py1.mongodb.net/shop?retryWrites=true&w=majority';

const app = express();
// Storing session data in mongoDB
const store = new MongoDBStore({
	uri: MONGODB_URI,
	collection: 'sessions',
});
const csrfProtection = csrf();

// app.set() sets global value which can be use in our whole app
// Sets the template engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// For parsing incoming request
app.use(express.urlencoded({ extended: false }));

// For serving static files i.e CSS files or images or javascript, etc
//  __dirname gives path till current file in pc

app.use(express.static(path.join(__dirname, 'public')));

// Middleware for setting up session and storing in mongoDB
app.use(
	session({
		secret: 'my secret',
		resave: false,
		saveUninitialized: false,
		store: store,
	})
);

// Applying csrfToken
app.use(csrfProtection);
// For flashing the error messages
app.use(flash());

app.use((req, res, next) => {
	if (!req.session.user) {
		return next();
	}
	User.findById(req.session.user._id)
		.then((user) => {
			req.user = user;
			next();
		})
		.catch((err) => console.log(err));
});

app.use((req, res, next) => {
	// res.locals allows as to create local variables
	// which are passed into the views
	res.locals.isAuthenticated = req.session.isLoggedIn;
	res.locals.csrfToken = req.csrfToken();
	next();
});

// Defining Routes
app.use('/admin', adminRoutes);
app.use('/', shopRoutes);
app.use('/', authRoutes);

// 404 Page
// path is not given then by default it takes home route i.e '/'
app.use(errorController.get404);

// Database connection
mongoose
	.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then((result) => {
		app.listen(3000);
	})
	.catch((err) => {
		console.log(err);
	});
