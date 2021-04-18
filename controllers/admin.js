const Product = require('../models/product');

// @method: GET
// @description: form for adding a new product
exports.getAddProduct = (req, res, next) => {
	res.render('admin/edit-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		editing: false,
	});
};

// @method: POST
// @description: Add a new product
exports.postAddProduct = (req, res, next) => {
	const title = req.body.title;
	const imageUrl = req.body.imageUrl;
	const price = req.body.price;
	const description = req.body.description;

	// Create entry of new data to the DB and save
	req.user
		.createProduct({
			title: title,
			price: price,
			imageUrl: imageUrl,
			description: description,
		})
		.then((result) => {
			console.log('Created Product');
			res.redirect('/admin/products');
		})
		.catch((err) => {
			console.log(err);
		});
};

// @method: GET
// @description: edit product
exports.getEditProduct = (req, res, next) => {
	// Using query params
	const editMode = req.query.edit;

	if (!editMode) {
		return res.redirect('/');
	}
	const prodId = req.params.productId;
	req.user
		.getProducts({ where: { id: prodId } })
		// Product.findByPk(prodId)
		.then((products) => {
			const product = products[0];
			if (!product) {
				return res.redirect('/');
			}
			res.render('admin/edit-product', {
				pageTitle: 'Edit Product',
				path: '/admin/edit-product',
				editing: editMode,
				product: product,
			});
		})
		.catch((err) => console.log(err));
};

// @method: POST
// @description: Update a product
exports.postEditProduct = (req, res, next) => {
	const prodId = req.body.productId;
	const updatedTitle = req.body.title;
	const updatedPrice = req.body.price;
	const updatedImageUrl = req.body.imageUrl;
	const updatedDesc = req.body.description;
	Product.findByPk(prodId)
		.then((product) => {
			product.title = updatedTitle;
			product.price = updatedPrice;
			product.description = updatedDesc;
			product.imageUrl = updatedImageUrl;

			return product.save();
		})
		.then((result) => {
			console.log('UPDATED PRODUCT!');
			res.redirect('/admin/products');
		})
		.catch((err) => console.log(err));
};

// @method: GET
// @description: Get all products
exports.getProducts = (req, res, next) => {
	req.user
		.getProducts()
		.then((products) => {
			res.render('admin/products', {
				prods: products,
				pageTitle: 'Admin Products',
				path: '/products',
			});
		})
		.catch((err) => console.log(err));
};

// @method: POST
// @description: Deleting a product
exports.postDeleteProduct = (req, res, next) => {
	const prodId = req.body.productId;
	Product.findByPk(prodId)
		.then((product) => {
			return product.destroy();
		})
		.then((result) => {
			console.log('DESTROYED PRODUCT');
			res.redirect('/admin/products');
		})
		.catch((err) => console.log(err));
};
