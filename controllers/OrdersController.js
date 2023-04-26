const Order = require('../models/ordersModel');

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({});

    res.status(200).json(orders.reverse());
  } catch (err) {
    res.status(400).json('bad');
  }
};

const createOrder = async (req, res) => {
  const { customerData, orders } = req.body;

  try {
    function getTotal() {
      let total = 0;
      orders.map((order) => {
        total += order.productPrice * order.quantity;
      });

      return total;
    }

    let total = getTotal();

    const newOrder = new Order({
      fname: customerData.fname,
      lname: customerData.lname,
      email: customerData.email,
      phone: customerData.phone,
      address: customerData.address,
      note: customerData.note,
      products: orders,
      orderTotal: total,
    });

    const result = await newOrder.save();
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json('bad');
  }
};

module.exports = { getOrders, createOrder };
