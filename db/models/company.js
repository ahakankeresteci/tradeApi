module.exports = (sequelize, DataTypes) => {
    return sequelize.define('companies',
        {
            legalName: {
                type: DataTypes.STRING(100),
                allowNull: false,
                field: 'legal_name'
            },
            shareSymbol: {
                type: DataTypes.STRING(3),
                allowNull: false,
                field: 'share_symbol'
            },
            shareQuantity: {
                type: DataTypes.DECIMAL(10),
                allowNull: false,
                field: 'share_quantity'
            },
            sharePrice: {
                type: DataTypes.DECIMAL(10,2),
                allowNull: false,
                fieald: 'share_price'
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
                    fields: ['share_symbol']
                }
            ]
        });
};