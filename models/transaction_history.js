module.exports = (sequelize, type) => {
    return sequelize.define('balances', {
      id: {
        allowNull: false,
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        allowNull: false,
        primaryKey: true,
        type: type.INTEGER,
      },
      amount: {
        allowNull: false,
        type: type.DECIMAL(10, 2),
      },
      operation: {
        allowNull: false,
        type: type.ENUM,
        values: ['add', 'subtract'],
      },
      created_at: {
        allowNull: true,
        type: type.DATE,
        defaultValue: type.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: true,
        type: type.DATE,
        defaultValue: type.literal('CURRENT_TIMESTAMP'),
      },
    });
  };
  
  