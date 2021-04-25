const Product = require('../models/product');
const Order = require('../models/order');

// @method: GET
// @description: Get all the products
exports.getIndex = (req, res, next) => {
	Product.find()
		.then((products) => {
			res.render('shop/index', {
				prods: products.reverse(),
				pageTitle: 'Shop',
				path: '/',
				isAuthenticated: req.session.isLoggedIn,
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

// @method: GET
// @description: Get all the products
exports.getProducts = (req, res, next) => {
	Product.find()
		.then((products) => {
			// console.log(products);
			res.render('shop/product-list', {
				prods: products,
				pageTitle: 'All Products',
				path: '/products',
				isAuthenticated: req.session.isLoggedIn,
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

// @method: GET
// @description: For each product
exports.getProduct = (req, res, next) => {
	const prodId = req.params.productId;
	Product.findById(prodId)
		.then((product) => {
			res.render('shop/product-details', {
				product: product,
				path: '/products',
				pageTitle: product.pageTitle,
				isAuthenticated: req.session.isLoggedIn,
			});
		})
		.catch((err) => console.log(err));
};

// @method: GET
// @description: To see list of products in cart
exports.getCart = (req, res, next) => {
	req.user
		.populate('cart.items.productId')
		.execPopulate()
		.then((user) => {
			const products = user.cart.items;

			res.render('shop/cart', {
				path: '/cart',
				pageTitle: 'Your Cart',
				products: products.reverse(),
				isAuthenticated: req.session.isLoggedIn,
			});
		})
		.catch((err) => console.log(err));
};

// @method: POST
// @description: Adding product to the cart
exports.postCart = (req, res, next) => {
	const prodId = req.body.productId;
	Product.findById(prodId)
		.then((product) => {
			return req.user.addToCart(product);
		})
		.then((result) => {
			console.log(result);
			res.redirect('/cart');
		})
		.catch((err) => console.log(err));
};

// @method: POST
// @description: Deleting a product from the cart
exports.postCartDeleteProduct = (req, res, next) => {
	const prodId = req.body.productId;
	req.user
		.removeFromCart(prodId)
		.then((result) => {
			res.redirect('/cart');
		})
		.catch((err) => console.log(err));
};

// @method: POST
// @description: For clearing cart and redirect to checkout
exports.postOrder = (req, res, next) => {
	req.user
		.populate('cart.items.productId')
		.execPopulate()
		.then((user) => {
			const products = user.cart.items.map((i) => {
				return { quantity: i.quantity, product: { ...i.productId._doc } };
			});
			const order = new Order({
				user: {
					name: req.user.name,
					userId: req.user,
				},
				products: products,
			});
			return order.save();
		})
		.then((result) => {
			return req.user.clearCart();
		})
		.then(() => {
			res.redirect('/orders');
		})
		.catch((err) => console.log(err));
};

// @method: GET
// @description: To get a list of orders
exports.getOrders = (req, res, next) => {
	Order.find({ 'user.userId': req.user._id })
		.then((orders) => {
			res.render('shop/orders', {
				path: '/orders',
				pageTitle: 'Your Orders',
				orders: orders,
				isAuthenticated: req.session.isLoggedIn,
			});
		})
		.catch((err) => console.log(err));
};
