const multer = require('multer');
const router = require('express').Router();
const {isAuth} = require('../middleware/authMiddleware')

const {
  createCategory,
  getCategories,
  deleteCategory
} = require('../controllers/CategoriesController');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.get('/get-categories', getCategories);
router.post('/create-category', isAuth, upload.single('file'), createCategory);
router.delete('/delete-category', isAuth, deleteCategory);

module.exports = router;
