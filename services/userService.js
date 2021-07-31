const _ = require('lodash');
const user = require('../db/models/user');
module.exports = () => {
    const models = require('../sequelize').models();
    const userModel = models.users;
    const portfolioModel = models.portfolios;
    const tradeModel = models.trade_requests;
    const holdingModel = models.holdings;
    const userService = {};

    userService.createUser = async (data) => {
        const clonedData = _.clone(data);
        let user;
        try {
            user = await userModel.create(clonedData);
        } catch (error) {
            throw error;
        }
        return user;
    };

    userService.bulkCreateUser = async (data) => {
        const clonedData = _.clone(data);
        let users;
        try {
            users = await Promise.all(_.map(clonedData, (userOpt) => {
                return userService.createUser(userOpt);
            }));
        } catch (error) {
            throw error;
        }
        return users;
    };

    userService.createPortfolio = async (userId, data) => {
        const clonedData = _.clone(data);
        _.assign(clonedData, { userId })
        let portfolio;
        try {
            const user = await userModel.findByPk(userId);
            if(!user){
                throw new Error('User Not Found');
            }
            if(user.portfolioId) {
                throw new Error('User can have only one portfolio')
            }
            portfolio = await portfolioModel.create(clonedData);
            updatedUser = await userModel.update({ portfolioId: portfolio.id },{ where:{ id: userId }});
        } catch (error) {
            throw error;
        }
        return portfolio;
    };

    userService.getUsers = async () => {
        let users;
        try {
            users = await userModel.findAll({
                include: [
                    {
                        model: portfolioModel,
                        as:'Portfolio'
                    },
                    {
                        model: tradeModel,
                        as: 'BuyRequests'
                    },
                    {
                        model: tradeModel,
                        as: 'SellRequests'
                    },
                    {
                        model: holdingModel,
                        as: 'OwnedShares'
                    }
                ]
            });
        } catch (error) {
            throw error;
        }
        return users;
    };

    userService.getUserById = async (id) => {
        let users;
        try {
            users = await userModel.findByPk(id,{
                include: [
                    {
                        model: portfolioModel,
                        as:'Portfolio'
                    },
                    {
                        model: tradeModel,
                        as: 'BuyRequests'
                    },
                    {
                        model: tradeModel,
                        as: 'SellRequests'
                    }
                ]
            });
        } catch (error) {
            throw error;
        }
        return users;
    };

    return userService;
};