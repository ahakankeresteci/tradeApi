const _ = require('lodash');
const moment = require('moment')
const { Op } = require('sequelize');
const { tradeTypes } = require('../constants');
const { requesterTypes } = require('../constants');
module.exports = () => {
    const models = require('../sequelize').models();
    const userModel = models.users;
    const tradeModel = models.trade_requests;
    const transactionModel = models.transactions;
    const portfolioModel = models.portfolios;
    const holdingModel = models.holdings;
    const userService = require('../services/userService');
    const tradeService = {};

    tradeService.createSellTradeRequest = async (data) => {
        const tradeOpt = _.clone(data);
        _.assign(tradeOpt, { transactionType: tradeTypes.sell, requesterType: requesterTypes.user } );
        await checkPortfolioExist(tradeOpt.requesterId);
        await checkShareSellAvailability(tradeOpt.requesterId, tradeOpt.shareSymbol, tradeOpt.quantity);
        let result;
        const sellNow = await getAvailableRequest(tradeOpt, tradeTypes.buy);
        if(sellNow.length != 0) {
            const theBuyRequest = _.maxBy(sellNow, ['price'])
            const cost = tradeOpt.quantity * tradeOpt.price;
            const transactions = [];
            const buyerHolding = await holdingModel.findOne({ where: { userId: theBuyRequest.requesterId, shareSymbol: theBuyRequest.shareSymbol} })
            const buyerPortfolio = await portfolioModel.findOne({where: { userId: theBuyRequest.requesterId }});
            const buyerNewBalance = buyerPortfolio.balance - cost;
            const buyerNewQuantity = buyerHolding ? parseInt(buyerHolding.quantity) + parseInt(tradeOpt.quantity): theBuyRequest.quantity;
            if (buyerHolding) {
                transactions.push(holdingModel.update({ quantity: buyerNewQuantity },{where: { userId: theBuyRequest.requesterId, shareSymbol: theBuyRequest.shareSymbol}}),
                );
            } else {
                transactions.push(holdingModel.create({ quantity: buyerNewQuantity, userId: theBuyRequest.requesterId, shareSymbol: theBuyRequest.shareSymbol}),
                )
            }

            const sellerHolding = await holdingModel.findOne({ where: { userId: tradeOpt.requesterId, shareSymbol: tradeOpt.shareSymbol} })
            const sellerPortfolio = await portfolioModel.findOne({where: { userId: tradeOpt.requesterId }});
            const sellerNewQuantity = sellerHolding.quantity - theBuyRequest.quantity;
            const sellerNewBalance = sellerPortfolio.balance + cost;

            transactions.push(
                portfolioModel.update({ balance: buyerNewBalance },{where: { userId: theBuyRequest.requesterId }}),
                holdingModel.update({ quantity: sellerNewQuantity },{where: { userId: tradeOpt.requesterId }}),
                portfolioModel.update({ balance: sellerNewBalance },{where: { userId: tradeOpt.requesterId }}),
                tradeModel.update({ quantity: (theBuyRequest.quantity - tradeOpt.quantity)},{where: { id: theBuyRequest.id }}),
                transactionModel.create({
                    fromUserId: tradeOpt.requesterId,
                    fromUserType: requesterTypes.user,
                    toUserId: theBuyRequest.requesterId,
                    toUserType: requesterTypes.user,
                    shareSymbol: tradeOpt.shareSymbol,
                    quantity: tradeOpt.quantity,
                    value: tradeOpt.price
                })
            );
            result = await Promise.all(transactions);
        }
        else {
            result = await tradeModel.create(tradeOpt);
        }
        try {
            
        } catch (error) {
            throw error;
        }
        return result;
    };

    tradeService.createBuyTradeRequest = async (data) => {
        const tradeOpt = _.clone(data);
        _.assign(tradeOpt, { transactionType: tradeTypes.buy, requesterType: requesterTypes.user } );
        const cost = tradeOpt.quantity * tradeOpt.price;
        await checkPortfolioExist(tradeOpt.requesterId, cost);
        let result;
        const buyNow = await getAvailableRequest(tradeOpt, tradeTypes.sell);
        if(buyNow.length != 0) {
            const theSellRequest = _.maxBy(buyNow, ['price'])
            const cost = tradeOpt.quantity * theSellRequest.price;
            let transactions = [];
            if(theSellRequest.requesterType === requesterTypes.user){
                const sellerHolding = await holdingModel.findOne({ where: { userId: theSellRequest.requesterId, shareSymbol: theSellRequest.shareSymbol} });
            const sellerPortfolio = await portfolioModel.findOne({where: { userId: theSellRequest.requesterId }});
            const sellerNewQuantity = sellerHolding.quantity - tradeOpt.quantity;
            const sellerNewBalance = sellerPortfolio.balance + cost;
            transactions.push([
                holdingModel.update({ quantity: sellerNewQuantity },{where: { userId: tradeOpt.userId }}),
                portfolioModel.update({ balance: sellerNewBalance },{where: { userId: tradeOpt.userId }}),
            ]);
            }
            const buyerHolding = await holdingModel.findOne({ where: { userId: tradeOpt.requesterId, shareSymbol: tradeOpt.shareSymbol } });
            const buyerPortfolio = await portfolioModel.findOne({ where: { userId: tradeOpt.requesterId } });
            if (buyerHolding) {
                const buyerNewQuantity = parseInt(buyerHolding.quantity) + parseInt(tradeOpt.quantity);
                const buyerNewBalance = buyerPortfolio.balance - cost;
                transactions.push(
                    holdingModel.update({ quantity: buyerNewQuantity }, { where: { userId: theSellRequest.requesterId, shareSymbol: theSellRequest.shareSymbol } }),
                    portfolioModel.update({ balance: buyerNewBalance }, { where: { userId: theSellRequest.requesterId } }),
                );
            } else {
                const buyerNewQuantity = tradeOpt.quantity;
                const buyerNewBalance = buyerPortfolio.balance - cost;
                transactions.push(
                    holdingModel.create({ quantity: buyerNewQuantity ,userId: tradeOpt.requesterId, shareSymbol: theSellRequest.shareSymbol  }),
                    portfolioModel.update({ balance: buyerNewBalance }, { where: { userId: theSellRequest.requesterId } }),
                );
            }

            transactions.push(
                tradeModel.update({ quantity: (theSellRequest.quantity - tradeOpt.quantity) }, { where: { id: theSellRequest.id } }),
                transactionModel.create({
                    fromUserId: theSellRequest.requesterId,
                    fromUserType: theSellRequest.requesterType,
                    toUserType: requesterTypes.user,
                    toUserId: tradeOpt.requesterId,
                    shareSymbol: tradeOpt.shareSymbol,
                    quantity: tradeOpt.quantity,
                    value: theSellRequest.price
                })
            );
            result = await Promise.all(transactions);
        }
        else {
            result = await tradeModel.create(tradeOpt);
        }
        try {
            
        } catch (error) {
            throw error;
        }
        return result;
    };

    tradeService.updateTradeRequest = async (data) => {
        const opt = _.clone(data);
        try {
            const tradeRequest = await tradeModel.findByPk(opt.id);
            if(moment(tradeRequest.updatedAt).add(1,'hours').isBefore(moment())){
                throw new Error('Price cannot be updated.');
            }
            const result = await tradeModel.update({ price: opt.price },{ where: { id: opt.id }});
            return result;
        } catch (error) {
            throw error;
        }
    };

    tradeService.deleteTradeRequest = async (id) => {
        try {
            const deletedTradeReq = await tradeModel.destroy({ where: { id }})
            return deletedTradeReq;
        } catch (error) {
            throw error;
        }
    };

    tradeService.getBoard = async () => {};

    tradeService.getTransactions = async () => {
        try {
            const result = await transactionModel.findAll();
            return result;
        } catch (error) {
            throw error;
        }
    };

    const checkPortfolioExist = async (userId, cost) => {
        try {
            const portfolio = await portfolioModel.findOne({
                where: {
                    userId
                }
            });
            if(!portfolio) {
                throw new Error('Portfolio Not Found');
            }
            if(cost && parseFloat(portfolio.balance)<parseFloat(cost)){
                throw new Error('Balance not enough for cost');
            }
            return portfolio;
        } catch (error) {
            throw error;
        }
    };

    const checkShareSellAvailability = async (userId, shareSymbol, quantity) => {
        try {
            const holding = await holdingModel.findOne({
                where: {
                    userId,
                    shareSymbol,
                    quantity: {
                        [Op.gte]: quantity
                    }
                }
            });
            if(!holding){
                throw new Error('Share should be registered and have enough quantity');
            }
        } catch (error) {
            throw error;
        }
    };

    const getAvailableRequest = async (tradeOpt, transactionType) => {
        try {
            const availableRequests = await tradeModel.findAll({
                where: {
                    transactionType,
                    shareSymbol: tradeOpt.shareSymbol,
                    quantity: transactionType === tradeTypes.buy ?
                    { 
                        [Op.lte]: tradeOpt.quantity
                    }: {
                        [Op.gte]: tradeOpt.quantity
                    },
                    price: transactionType === tradeTypes.buy ?
                    { 
                        [Op.gte]: tradeOpt.price
                    }: {
                        [Op.lte]: tradeOpt.price
                    }
                }
            });
            return availableRequests;
        } catch (error) {
            throw error;
        }
    };

    return tradeService;
};