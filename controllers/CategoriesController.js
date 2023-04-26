const Category = require('../models/categoriesModel');
const Product = require('../models/productModel');

const { saveImage, getImage, deleteImage } = require('../helpers/awsS3');

const createCategory = async (req, res) => {
  const obj = JSON.parse(JSON.stringify(req.body));
  const file = req.file;
  try {
    const fileName = await saveImage(file);

    console.log(fileName);

    const pictureObj = {
      fileName: fileName,
      fileSize: file.size,
    };

    const newCategory = new Category({
      name: obj.name,
      letter: obj.letter,
      picture: pictureObj,
    });

    const result = await newCategory.save();

    res.status(201).json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'Invalid Request' });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});

    const result = await getImage(categories);

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'Invalid Request' });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.body;
  try {
    const categoryProducts = await Product.find({ categoryId: id });

    if (categoryProducts.length > 0) {
      res
        .status(400)
        .json({
          message: "You can't delete a category that contains products",
        });
      return;
    }

    const selectedCategory = await Category.findByIdAndDelete({
      _id: id,
    });

    const result = await deleteImage(selectedCategory.picture.fileName);

    res.status(201).json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'Invalid Request' });
  }
};

module.exports = { createCategory, getCategories, deleteCategory };
