const { tradeTypes } = require('../constants');
const { requesterTypes } = require('../constants');
module.exports = (models) => {
    models.users.hasOne(models.portfolios, { foreignKey: 'userId', as:'Portfolio' });
    models.users.hasMany(models.holdings, { foreignKey: 'userId', as:'OwnedShares' });
    models.users.hasMany(models.trade_requests, { foreignKey: 'requesterId', scope: { transactionType: tradeTypes.buy, requesterType: requesterTypes.user }, as:'BuyRequests' });
    models.users.hasMany(models.trade_requests, { foreignKey: 'requesterId', scope: { transactionType: tradeTypes.sell, requesterType: requesterTypes.user }, as:'SellRequests' });

    models.holdings.belongsTo(models.users, { foreignKey: 'userId' });
    models.portfolios.belongsTo(models.users, { foreignKey: 'userId' });

    
};