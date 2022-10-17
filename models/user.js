module.exports = (sequelize, type) => {
  return sequelize.define('users', {
    id: {
      allowNull: false,
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      allowNull: false,
      type: type.STRING,
    },
    password: {
      allowNull: false,
      type: type.STRING,
    },
    is_verified: {
      allowNull: false,
      defaultValue: false,
      type: type.INTEGER,
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

