const crypto = require('crypto'); // To generate tokens

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');

const User = require('../models/user');

// configuring the nodemailer
const transporter = nodemailer.createTransport({
	name: 'nodeproject',
	host: 'smtp.mailtrap.io',
	port: 2525,
	auth: {
		user: '7c269d0e278fe5',
		pass: '1f43476d63a43e',
	},
});

// @method: GET
// @description: To goto login page
exports.getLogin = (req, res, next) => {
	let message = req.flash('error');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render('auth/login', {
		path: '/login',
		pageTitle: 'Login',
		errorMessage: message,
		oldInput: {
			email: '',
			password: '',
		},
		validationErrors: [],
	});
};

// @method: GET
// @description: To goto signup page
exports.getSignup = (req, res, next) => {
	let message = req.flash('error');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render('auth/signup', {
		path: '/signup',
		pageTitle: 'Signup',
		errorMessage: message,
		oldInput: {
			email: '',
			password: '',
			confirmPassword: '',
		},
		validationErrors: [],
	});
};

// @method: POST
// @description: Login for existing user
exports.postLogin = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).render('auth/login', {
			path: '/login',
			pageTitle: 'Login',
			errorMessage: errors.array()[0].msg,
			oldInput: {
				email: email,
				password: password,
			},
			validationErrors: errors.array(),
		});
	}
	User.findOne({ email: email })
		.then((user) => {
			if (!user) {
				return res.status(422).render('auth/login', {
					path: '/login',
					pageTitle: 'Login',
					errorMessage: 'Invalid email or password!',
					oldInput: {
						email: email,
						password: password,
					},
					validationErrors: errors.array(),
				});
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
					return res.status(422).render('auth/login', {
						path: '/login',
						pageTitle: 'Login',
						errorMessage: 'Invalid email or password!',
						oldInput: {
							email: email,
							password: password,
						},
						validationErrors: errors.array(),
					});
				})
				.catch((err) => {
					console.log(err);
				});
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

// @method: POST
// @description: To signup for new user
exports.postSignup = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		// Status code 422 in validation failed error
		return res.status(422).render('auth/signup', {
			path: '/signup',
			pageTitle: 'Signup',
			errorMessage: errors.array()[0].msg,
			oldInput: {
				email: email,
				password: password,
				confirmPassword: req.body.confirmPassword,
			},
			validationErrors: errors.array(),
		});
	}

	// User.findOne({ email: email });
	// .then((userDoc) => {
	// 	if (userDoc) {
	// 		req.flash('error', 'Email already exists, please use another one.');
	// 		return res.redirect('/signup');
	// 	}
	bcrypt
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
			// Sending mails
			return transporter.sendMail({
				from: '"Node project" <mathurrohan04@gmail.com>',
				to: email,
				subject: 'Signup succeeded!',
				html: '<h1>You successfully signed up 🎉</h1>',
			});
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

// @method: POST
// @description: To logout
exports.postLogout = (req, res, next) => {
	req.session.destroy((err) => {
		console.log(err);
		res.redirect('/');
	});
};

// @method: GET
// @description: To goto the reset page
exports.getReset = (req, res, next) => {
	let message = req.flash('error');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render('auth/reset', {
		path: '/reset',
		pageTitle: 'Reset password',
		errorMessage: message,
	});
};

// @method: POST
// @description: Resetting the password
exports.postReset = (req, res, next) => {
	// Generating token for password reset
	crypto.randomBytes(32, (err, buffer) => {
		if (err) {
			console.log(err);
			return res.redirect('/reset');
		}
		const token = buffer.toString('hex');
		User.findOne({ email: req.body.email })
			.then((user) => {
				if (!user) {
					req.flash('error', 'No account with that email found.');
					return res.redirect('/reset');
				}
				user.resetToken = token;
				user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
				// console.log('In DB:', user.resetTokenExpiration);
				return user.save();
			})
			.then((result) => {
				res.redirect('/');
				// Sending mail for reset password
				transporter.sendMail({
					from: '"Node project" <mathurrohan04@gmail.com>',
					to: req.body.email,
					subject: 'Password reset!',
					html: `
					<p>You requested a password reset</p>
					<p>Click this <a href = "http://localhost:3000/reset/${token}}">link</a> to set a new password.</p>
					`,
				});
			})
			.catch((err) => {
				const error = new Error(err);
				error.httpStatusCode = 500;
				return next(error);
			});
	});
};

// @method: GET
// @description: Displaying form for reset password
exports.getNewPassword = (req, res, next) => {
	const token = req.params.token;
	// Checking if token is valid or not
	// #gt means greater then
	User.findOne({
		resetToken: token,
		resetTokenExpiration: { $gt: new Date() },
	})
		.then((user) => {
			let message = req.flash('error');
			if (message.length > 0) {
				message = message[0];
			} else {
				message = null;
			}
			res.render('auth/new-password', {
				path: '/new-password',
				pageTitle: 'New password',
				errorMessage: message,
				userId: user._id.toString(),
				passwordToken: token,
			});
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

// @method: POST
// @description: Reset password logic
exports.postNewPassword = (req, res, next) => {
	const newPassword = req.body.password;
	const userId = req.body.userId;
	const passwordToken = req.body.passwordToken;
	let resetUser;

	User.findOne({
		resetToken: passwordToken,
		resetTokenExpiration: { $gt: Date.now() },
		_id: userId,
	})
		.then((user) => {
			resetUser = user;
			return bcrypt.hash(newPassword, 12);
		})
		.then((hashedPassword) => {
			resetUser.password = hashedPassword;
			resetUser.resetToken = undefined;
			resetUser.resetTokenExpiration = undefined;
			return resetUser.save();
		})
		.then((result) => {
			res.redirect('/login');
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};
