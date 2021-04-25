const User = require('../models/user');

exports.getLogin = (req, res, next) => {
	// Retrieving a Cookie
	// const isLoggedIn =
	// 	req.get('Cookie').split(';')[2].trim().split('=')[1] === 'true';
	res.render('auth/login', {
		path: '/login',
		pageTitle: 'Login',
		isAuthenticated: false,
	});
};

exports.postLogin = (req, res, next) => {
	User.findById('6084614c503bcf07e0435362')
		.then((user) => {
			// Setting session
			req.session.isLoggedIn = true;
			req.session.user = user;
			res.redirect('/');
		})
		.catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
	req.session.destroy((err) => {
		console.log(err);
		res.redirect('/');
	});
};
