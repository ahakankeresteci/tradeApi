module.exports = (sequelize, DataTypes) => {
    return sequelize.define('users',
      {
        userName: {
          type: DataTypes.STRING,
          allowNull: false,
          field: 'user_name'
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'first_name'
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'last_name'
        },
        portfolioId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: 'portfolio_id'
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
              fields: ['user_name']
          }
      ]
      });
  };
  