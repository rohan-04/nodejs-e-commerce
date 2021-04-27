const bcrypt = require('bcryptjs');

const User = require('../models/user');

// @method: GET
// @description: To goto login page
exports.getLogin = (req, res, next) => {
	let message = req.flash('error');
	console.log(message);
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render('auth/login', {
		path: '/login',
		pageTitle: 'Login',
		errorMessage: message,
	});
};

// @method: GET
// @description: To goto signup page
exports.getSignup = (req, res, next) => {
	res.render('auth/signup', {
		path: '/signup',
		pageTitle: 'Signup',
	});
};

// @method: POST
// @description: Login for existing user
exports.postLogin = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	User.findOne({ email: email })
		.then((user) => {
			if (!user) {
				req.flash('error', 'Invalid email or password!');
				return res.redirect('/login');
			}
			bcrypt
				.compare(password, user.password)
				.then((doMatch) => {
					if (doMatch) {
						// Creating a session
						req.session.isLoggedIn = true;
						req.session.user = user;
						return req.session.save((err) => {
							console.log(err);
							res.redirect('/');
						});
					}
					res.redirect('/login');
				})
				.catch((err) => {
					console.log(err);
				});
		})
		.catch((err) => console.log(err));
};

// @method: POST
// @description: To signup for new user
exports.postSignup = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	const confirmPassword = req.body.confirmPassword;
	User.findOne({ email: email })
		.then((userDoc) => {
			if (userDoc) {
				return res.redirect('/signup');
			}
			return bcrypt
				.hash(password, 12)
				.then((hashedPassword) => {
					const user = new User({
						email: email,
						password: hashedPassword,
						cart: { items: [] },
					});

					return user.save();
				})
				.then((result) => {
					res.redirect('/login');
				});
		})
		.catch((err) => console.log(err));
};

// @method: POST
// @description: To logout
exports.postLogout = (req, res, next) => {
	req.session.destroy((err) => {
		console.log(err);
		res.redirect('/');
	});
};
