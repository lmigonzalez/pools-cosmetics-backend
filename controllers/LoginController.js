const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const Jwt = require('jsonwebtoken');

const newUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const createdUser = new User({
      email: email,
      password: hashedPassword,
    });

    const result = await createdUser.save();
    res.status(201).json(result);
  } catch (err) {
    res.status(404).json({ message: err });
  }
};

const login = async (req, res) => {
  let token;
  try {
	  const user = await User.findOne({
		  email: req.body.email,
		});
		
		
		if (!user) {
			res.status(404).json({
				message: 'User not found!',
			});
			return;
		}
		const validPassword = await bcrypt.compare(
			req.body.password,
			user.password
			);

    if (!user || !validPassword) {
      res.status(404).json({
        message: 'user not found!',
      });
      return;
    }

    token = Jwt.sign(user.toJSON(), process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '1w',
    });

    res.status(201).json({ user: user.toObject({ getters: true }), token });
  } catch (err) {
    res
      .status(404)
      .json({ message: 'Wrong email/password. Please try again!' });
  }
};


module.exports = {login, newUser}