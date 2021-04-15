const Product = require('../models/product');
const Cart = require('../models/cart');

// @method: GET
// @description: Get all the products
exports.getIndex = (req, res, next) => {
	Product.fetchAll()
		.then(([rows, fieldData]) => {
			res.render('shop/index', {
				prods: rows,
				pageTitle: 'Shop',
				path: '/',
			});
		})
		.catch((err) => console.log(err));
};

// @method: GET
// @description: Get all the products
exports.getProducts = (req, res, next) => {
	Product.fetchAll()
		.then(([rows, fieldData]) => {
			res.render('shop/product-list', {
				prods: rows,
				pageTitle: 'All Products',
				path: '/products',
			});
		})
		.catch((err) => console.log(err));
};

// @method: GET
// @description: For each product
exports.getProduct = (req, res, next) => {
	const prodId = req.params.productId;
	Product.findById(prodId)
		.then(([product]) => {
			res.render('shop/product-details', {
				product: product[0],
				path: '/products',
				pageTitle: product.pageTitle,
			});
		})
		.catch((err) => console.log(err));
};

// @method: GET
// @description: To see list of products in cart
exports.getCart = (req, res, next) => {
	Cart.getCart((cart) => {
		Product.fetchAll((products) => {
			const cartProducts = [];
			for (product of products) {
				const cartProductData = cart.products.find(
					(prod) => prod.id === product.id
				);
				if (cartProductData) {
					cartProducts.push({ productData: product, qty: cartProductData.qty });
				}
			}
			res.render('shop/cart', {
				path: '/cart',
				pageTitle: 'Your Cart',
				products: cartProducts,
			});
		});
	});
};

// @method: POST
// @description: Adding product to the cart
exports.postCart = (req, res, next) => {
	const prodId = req.body.productId;
	Product.findById(prodId, (product) => {
		Cart.addProduct(prodId, product.price);
	});
	res.redirect('/cart');
};

// @method: POST
// @description: Deleting a product from the cart
exports.postCartDeleteProduct = (req, res, next) => {
	const prodId = req.body.productId;
	Product.findById(prodId, (product) => {
		Cart.deleteProduct(prodId, product.price);
		res.redirect('/cart');
	});
};

// @method: GET
// @description:
exports.getOrders = (req, res, next) => {
	res.render('shop/orders', {
		path: '/orders',
		pageTitle: 'Your Orders',
	});
};

// @method: GET
// @description: Go to the checkout page
exports.getCheckout = (req, res, next) => {
	res.render('shop/checkout', {
		path: '/checkout',
		pageTitle: 'Checkout',
	});
};
