const Product = require('../models/product');

// @method: GET
// @description: Get all the products
exports.getIndex = (req, res, next) => {
	Product.findAll()
		.then((products) => {
			res.render('shop/index', {
				prods: products.reverse(),
				pageTitle: 'Shop',
				path: '/',
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

// @method: GET
// @description: Get all the products
exports.getProducts = (req, res, next) => {
	Product.findAll()
		.then((products) => {
			res.render('shop/product-list', {
				prods: products,
				pageTitle: 'All Products',
				path: '/products',
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
	// Product.findAll({ where: { id: prodId } })
	// 	.then((products) => {
	// 		res.render('shop/product-details', {
	// 			product: products[0],
	// 			path: '/products',
	// 			pageTitle: products[0].pageTitle,
	// 		});
	// 	})
	// 	.catch((err) => console.log(err));

	Product.findByPk(prodId)
		.then((product) => {
			res.render('shop/product-details', {
				product: product,
				path: '/products',
				pageTitle: product.pageTitle,
			});
		})
		.catch((err) => console.log(err));
};

// @method: GET
// @description: To see list of products in cart
exports.getCart = (req, res, next) => {
	req.user
		.getCart()
		.then((cart) => {
			return cart
				.getProducts()
				.then((products) => {
					res.render('shop/cart', {
						path: '/cart',
						pageTitle: 'Your Cart',
						products: products.reverse(),
					});
				})
				.catch((err) => console.log(err));
		})
		.catch((err) => console.log(err));
	// Cart.getCart((cart) => {
	// 	Product.fetchAll((products) => {
	// 		const cartProducts = [];
	// 		for (product of products) {
	// 			const cartProductData = cart.products.find(
	// 				(prod) => prod.id === product.id
	// 			);
	// 			if (cartProductData) {
	// 				cartProducts.push({ productData: product, qty: cartProductData.qty });
	// 			}
	// 		}
	// 		res.render('shop/cart', {
	// 			path: '/cart',
	// 			pageTitle: 'Your Cart',
	// 			products: cartProducts,
	// 		});
	// 	});
	// });
};

// @method: POST
// @description: Adding product to the cart
exports.postCart = (req, res, next) => {
	const prodId = req.body.productId;
	let fetchedCart;
	let newQuantity = 1;
	req.user
		.getCart()
		.then((cart) => {
			fetchedCart = cart;
			return cart.getProducts({ where: { id: prodId } });
		})
		.then((products) => {
			let product;
			if (products.length > 0) {
				product = products[0];
			}

			if (product) {
				const oldQuantity = product.cartItem.quantity;
				newQuantity = oldQuantity + 1;
				return product;
			}
			return Product.findByPk(prodId);
		})
		.then((product) => {
			return fetchedCart.addProduct(product, {
				through: { quantity: newQuantity },
			});
		})
		.then(() => {
			res.redirect('/cart');
		})
		.catch((err) => console.log(err));
};

// @method: POST
// @description: Deleting a product from the cart
exports.postCartDeleteProduct = (req, res, next) => {
	const prodId = req.body.productId;
	req.user
		.getCart()
		.then((cart) => {
			return cart.getProducts({ where: { id: prodId } });
		})
		.then((products) => {
			const product = products[0];
			return product.cartItem.destroy();
		})
		.then((result) => {
			res.redirect('/cart');
		})
		.catch((err) => console.log(err));
};

// @method: POST
// @description: For clearing cart and redirect to checkout
exports.postOrder = (req, res, next) => {
	let fetchedCart;
	req.user
		.getCart()
		.then((cart) => {
			fetchedCart = cart;
			return cart.getProducts();
		})
		.then((products) => {
			req.user
				.createOrder()
				.then((order) => {
					return order.addProducts(
						products.map((product) => {
							product.orderItem = { quantity: product.cartItem.quantity };
							return product;
						})
					);
				})
				.catch((err) => console.log(err));
		})
		.then((result) => {
			return fetchedCart.setProducts(null);
		})
		.then((result) => {
			res.redirect('/orders');
		})
		.catch((err) => console.log(err));
};

// @method: GET
// @description: To get a list of orders
exports.getOrders = (req, res, next) => {
	req.user
		.getOrders({ include: ['products'] })
		.then((orders) => {
			res.render('shop/orders', {
				path: '/orders',
				pageTitle: 'Your Orders',
				orders: orders,
			});
		})
		.catch((err) => console.log(err));
};
