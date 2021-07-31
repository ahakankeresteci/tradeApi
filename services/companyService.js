const _ = require('lodash');
const { tradeTypes } = require('../constants');
const { requesterTypes } = require('../constants');
module.exports = () => {
    const models = require('../sequelize').models();
    const userModel = models.users;
    const tradeModel = models.trade_requests;
    const transactionModel = models.transactions;
    const companyModel = models.companies;

    const companyService = {};

    companyService.createCompany = async (data) => {
        let company;
        const opt = _.clone(data);
        if (opt.shareSymbol.length !== 3) {
            throw new Error('Share Symbol must be 3 Characters.');
        }
        _.assign(opt, { shareSymbol: opt.shareSymbol.toUpperCase() });
        try {
            company = await companyModel.create(opt);
            tradeRequests = await tradeModel.create(
               {
                    requesterId: company.id,
                    requesterType: requesterTypes.company,
                    shareSymbol: company.shareSymbol,
                    transactionType: tradeTypes.sell,
                    quantity: company.shareQuantity,
                    price: company.sharePrice
                }
            );
        } catch (error) {
            throw error;
        }
        return company;
    };

    companyService.bulkCreateCompany = async (data)  => {
        let companies = [];
        const opt = _.assign(data);
        try {
            companies = await Promise.all(_.map(opt, (option) => {
                return companyService.createCompany(option);
            }));
        } catch (error) {
            throw error;
        }
        return companies;
    };

    return companyService;
};