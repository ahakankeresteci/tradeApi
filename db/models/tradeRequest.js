const { tradeTypes } = require('../../constants');
const { requesterTypes } = require('../../constants');
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('trade_requests',
    {
      requesterId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'requester_id'
      },
      requesterType: {
        type: DataTypes.ENUM(...Object.values(requesterTypes)),
        allowNull: false,
        field: 'requester_type'
      },
      shareSymbol: {
        type: DataTypes.STRING(3),
        allowNull: false,
        field: 'share_symbol'
      },
      transactionType: {
        type: DataTypes.ENUM(...Object.values(tradeTypes)),
        allowNull: false,
        field: 'transaction_type'
      },
      quantity: {
        type: DataTypes.DECIMAL(10),
        allowNull: false,
        field: 'quantity'
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        fieald: 'price'
      }
    },
    {
      timestamps: true,
      paranoid: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at'
    });
};
