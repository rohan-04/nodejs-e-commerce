const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const errorController = require('./controllers/error');

const app = express();

// app.set() sets global value which can be use in our whole app
app.set('view engine', 'ejs');
app.set('views', 'views');

// For parsing incoming request
app.use(bodyParser.urlencoded({ extended: false }));

// For serving static files i.e CSS files or images or javascript, etc
//  __dirname gives path till current file in pc
app.use(express.static(path.join(__dirname, 'public')));

// Defining Routes
app.use('/admin', adminRoutes);
app.use('/', shopRoutes);

// 404 Page
// path is not given then by default it takes home route i.e '/'
app.use(errorController.get404);

// const server = http.createServer(app);
// server.listen(3000);
app.listen(3000);
