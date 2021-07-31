const { tradeTypes } = require('../../constants');
const { requesterTypes } = require('../../constants');
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('transactions',
      {
        fromUserId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'from_user_id'
        },
        fromUserType: {
          type: DataTypes.ENUM(...Object.values(requesterTypes)),
          allowNull: false,
          field: 'from_user_type'
        },
        toUserId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'to_user_id'
          },
          toUserType: {
            type: DataTypes.ENUM(...Object.values(requesterTypes)),
            allowNull: false,
            field: 'to_user_type'
          },
        shareSymbol: {
          type: DataTypes.STRING(3),
          allowNull: false,
          field: 'share_symbol'
        },
        quantity: {
          type: DataTypes.DECIMAL(10),
          allowNull: false,
          field: 'quantity'
        },
        value: {
          type: DataTypes.DECIMAL(10,2),
          allowNull: false,
          field: 'value'
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
  