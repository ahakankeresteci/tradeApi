const { requesterTypes } = require('../../constants');
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('holdings',
      {
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'user_id'
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
        }
      },
      {
        timestamps: true,
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        indexes: [
          {
              unique: true,
              fields: ['user_id', 'share_symbol']
          }
      ]
      });
  };
  