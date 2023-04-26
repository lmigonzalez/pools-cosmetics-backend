const Product = require('../models/productModel');
const Category = require('../models/categoriesModel');

const {
  saveImageOnProduct,
  getAllProductsImage,
  getProductImagesById,
  deleteProductImages,
} = require('../helpers/awsS3');

const createProduct = async (req, res) => {
  const obj = JSON.parse(JSON.stringify(req.body));
  const files = req.files;

  try {
    const filesArray = await saveImageOnProduct(files);

    const category = await Category.findOne({ name: obj.categoryName });

    const newProduct = new Product({
      name: obj.productName,
      categoryId: category._id.valueOf(),
      categoryLetter: category.letter,
      categoryName: category.name,
      price: obj.currentPrice,
      oldPrice: obj.oldPrice,
      description: obj.description,
      pictures: filesArray,
    });

    const result = await newProduct.save();

    res.status(201).json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'Invalid Request' });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});

    const result = await getAllProductsImage(products);

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json('bad');
  }
};

const getProductByCategory = async (req, res) => {
  const categoryId = req.params.id;
  try {
    const products = await Product.find({ categoryId });

    const result = await getAllProductsImage(products);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json('bad');
  }
};

const getProductById = async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Product.findById(productId);
    const result = await getProductImagesById(product);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json('bad');
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.body;
  try {
    const selectedProduct = await Product.findByIdAndDelete({
      _id: id,
    });

    const result = await deleteProductImages(selectedProduct.pictures);
    res.status(202).json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'Invalid Request' });
  }
};

const editProduct = async (req, res) => {
  const product = req.body;
  const id = req.body.id;

  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id },
      product,
      { new: true }
    );
    res.status(202).json(updatedProduct);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'Invalid Request' });
  }
};


module.exports = {
  createProduct,
  getAllProducts,
  getProductByCategory,
  getProductById,
  deleteProduct,
  editProduct,
};
