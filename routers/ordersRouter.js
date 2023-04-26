const router = require('express').Router()

const {getOrders, createOrder} = require('../controllers/OrdersController')

const {isAuth} = require('../middleware/authMiddleware')

router.get('/get-orders', isAuth, getOrders);

router.post('/create-order', createOrder);

module.exports = router