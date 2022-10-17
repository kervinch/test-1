const { User, Balance } = require('../../sequelize');

module.exports.withdraw = async function (req, res) {
    const { userId, amount } = req.body;
  
    if (userId == null || userId == undefined ||
        amount == null || amount == undefined
    ) {
      res.status(400).json({
        error: 'Bad Request',
      });
      return;
    }

    const user = await User.findOne({
        where: { id: userId },
    });
  
    if (user == null) {
        res.status(404).json({
            error: 'User not found.',
        });
        return;
    }

    const balance = await Balance.findOne({
        where: { user_id: user.id },
    });

    if (amount > balance.balance) {
        res.status(400).json({
            error: 'Insufficient balance.',
        });
        return;
    }

    const newBalance = parseFloat(balance.balance) - parseFloat(amount);

    await Balance.update({
        balance: newBalance,
      }, {
        where: {
            user_id: user.id,
        },
    });

    return res.json({
        status: 200,
        data: {
          balance: newBalance,
        }
    });
}