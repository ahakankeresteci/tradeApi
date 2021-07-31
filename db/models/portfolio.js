module.exports = (sequelize, DataTypes) => {
    return sequelize.define('portfolios',
      {
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'user_id'
        },
        balance: {
          type: DataTypes.DECIMAL(10,2),
          allowNull: false,
          field: 'balance'
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
  