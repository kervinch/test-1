const { User, Balance } = require('../../sequelize');
const PasswordHash = require('../../service/PasswordHash').PasswordHash;
const { ValidationError } = require('sequelize');
const jwt = require('jsonwebtoken');

module.exports.helloWorld = async function (req, res) {
    return res.status(200).json({
        "hello": "world",
    });
}

module.exports.register = async function (req, res) {
    const { email, password } = req.body;
  
    if (email == null || email == undefined ||
      password == null || password == undefined
    ) {
      res.status(400).json({
        error: 'Bad Request',
      });
      return;
    }
  
    const hasher = new PasswordHash(8, true);
    const hashedPassword = await hasher.hashPassword(password);

    const isExist = await User.findOne({
      where: { email: email },
    });

    if (isExist !== null) {
      res.status(404).json({
        error: 'Email already exist!',
      });
      return;
    }
  
    try {
      const user = await User.create({
        email: email,
        password: hashedPassword,
        is_verified: 0,
      });

      const balance = await Balance.create({
        user_id: user.id,
        balance: 0,
      });
  
      return res.json({
        status: 200,
        data: {
          user_id: user.id,
          balance: balance.balance,
        }
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({
          error: 'Bad Request',
          explanation: error,
        });
        return;
      }
      res.status(500).json({
        error: error,
      });
      return;
    }
  };

  module.exports.login = async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;
  
    if (email == null || email == undefined || password == null || password == undefined) {
      res.status(400).json({
        error: 'Bad Request',
      });
      return;
    }
  
    try {
      const user = await User.findOne({
        where: { email: email },
      });
  
      if (user == null) {
        res.status(404).json({
          error: 'Email is not registered',
        });
        return;
      }
  
      const storedHash = user.password;
  
      const hasher = new PasswordHash(8, true);
      const valid = hasher.checkPassword(password, storedHash);
  
      if (valid) {
        const token = jwt.sign({ userId: user.id, email: user.email }, process.env.TOKEN_SECRET, { expiresIn: '168h' });
  
        return res.json({
          status: 200,
          data: {
            token: token,
          },
        });
      } else {
        res.status(401).json({
          error: 'Unauthorized',
        });
        return;
      }
    } catch (exception) {
      res.status(500).json({
        error: exception,
      });
      return;
    }
  };