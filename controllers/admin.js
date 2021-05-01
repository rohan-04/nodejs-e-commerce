const Product = require('../models/product');

// @method: GET
// @description: form for adding a new product
exports.getAddProduct = (req, res, next) => {
	res.render('admin/edit-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		editing: false,
		isAuthenticated: req.session.isLoggedIn,
	});
};

// @method: POST
// @description: Add a new product
exports.postAddProduct = (req, res, next) => {
	const title = req.body.title;
	const imageUrl = req.body.imageUrl;
	const price = req.body.price;
	const description = req.body.description;
	const product = new Product({
		title: title,
		price: price,
		description: description,
		imageUrl: imageUrl,
		userId: req.user, // this will only pick the id of user i.e _id
	});
	product
		.save()
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
	Product.findById(prodId)
		.then((product) => {
			if (!product) {
				return res.redirect('/');
			}
			res.render('admin/edit-product', {
				pageTitle: 'Edit Product',
				path: '/admin/edit-product',
				editing: editMode,
				product: product,
				isAuthenticated: req.session.isLoggedIn,
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

	Product.findById(prodId)
		.then((product) => {
			// Check for authorization
			if (product.userId.toString() != req.user._id.toString()) {
				res.redirect('/');
			}
			product.title = updatedTitle;
			product.price = updatedPrice;
			product.description = updatedDesc;
			product.imageUrl = updatedImageUrl;
			return product.save().then((result) => {
				console.log('UPDATED PRODUCT!');
				res.redirect('/admin/products');
			});
		})
		.catch((err) => console.log(err));
};

// @method: GET
// @description: Get all products
exports.getProducts = (req, res, next) => {
	// Only allowing user to edit or delete products which are added by them only
	// Authorization
	Product.find({ userId: req.user._id })
		// .select('title price -_id')
		// .populate('userId', 'name')
		.then((products) => {
			// console.log(products);
			res.render('admin/products', {
				prods: products,
				pageTitle: 'Admin Products',
				path: '/products',
				isAuthenticated: req.session.isLoggedIn,
			});
		})
		.catch((err) => console.log(err));
};

// @method: POST
// @description: Deleting a product
exports.postDeleteProduct = (req, res, next) => {
	const prodId = req.body.productId;
	Product.deleteOne({ _id: prodId, userId: req.user._id })
		.then((result) => {
			console.log('DESTROYED PRODUCT');
			res.redirect('/admin/products');
		})
		.catch((err) => console.log(err));
};
