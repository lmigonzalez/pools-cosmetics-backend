const jwt = require('jsonwebtoken');

const isAuth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "You don't have access" });
  }
  const token = req.headers.authorization.split(' ')[1];


  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid Token' });
  }
};

module.exports = { isAuth };
