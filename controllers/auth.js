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
	// // Setting Cookie
	//// res.setHeader('Set-Cookie', 'loggedIn=true');

	// Setting session
	req.session.isLoggedIn = true;
	res.redirect('/');
};
