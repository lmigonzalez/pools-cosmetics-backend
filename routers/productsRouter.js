const multer = require('multer');
const router = require('express').Router();
const {isAuth} = require('../middleware/authMiddleware')

const {createProduct, getAllProducts, getProductByCategory, getProductById, deleteProduct, editProduct} = require('../controllers/ProductsController')

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.get('/get-products', getAllProducts);

router.post('/create-product', isAuth, upload.array('files', 4), createProduct);

router.get('/get-selected-products/:id', getProductByCategory);

router.get('/get-product-by-id/:id', getProductById)

router.delete('/delete-product', isAuth, deleteProduct)

router.put('/edit-product', isAuth, editProduct)

router.put('/toggle-product', isAuth, editProduct)

module.exports = router