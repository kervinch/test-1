/* eslint-disable new-cap */
const Sequelize = require('sequelize');
const dotenv = require('dotenv');

const UserModel = require('./models/user');
const BalanceModel = require('./models/balance');
const TransactionHistoryModel = require('./models/transaction_history');

dotenv.config();

console.log('INIT SEQUELIZE');
let sequelize = null;

sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
  dialect: 'mysql',
  host: process.env.DATABASE_HOST,
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
  define: {
    timestamps: false,
    freezeTableName: true,
  },
});

const User = UserModel(sequelize, Sequelize);
const Balance = BalanceModel(sequelize, Sequelize);
const TransactionHistory = TransactionHistoryModel(sequelize, Sequelize);

User.hasMany(Balance, {
  foreignKey: 'user_id',
});

User.hasMany(TransactionHistory, {
  foreignKey: 'user_id',
});

module.exports = {
  sequelize,
  User,
  Balance,
  TransactionHistory,
};
