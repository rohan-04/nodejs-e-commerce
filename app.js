const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

app.engine(
	'hbs',
	expressHbs({ layoutsDir: 'views/layouts/', defaultLayout: 'main-layout' })
);
// app.set() sets global value which can be use in our whole app
app.set('view engine', 'hbs');
app.set('views', 'views');

// For parsing incoming request
app.use(bodyParser.urlencoded({ extended: false }));

// For serving static files i.e CSS files or images or javascript, etc
//  __dirname gives path till current file in pc
app.use(express.static(path.join(__dirname, 'public')));

// Defining Routes
app.use('/admin', adminData.routes);
app.use('/', shopRoutes);

// 404 Page
app.use('/', (req, res, next) => {
	res.status(404).render('404', { pageTitle: 'Page Not Found' });
});

// const server = http.createServer(app);
// server.listen(3000);
app.listen(3000);
