module.exports = async (models) => {
    const userModel = models.users;
    const tradeModel = models.trade_requests;
    const portfolioModel = models.portfolios;
    const holdingModel = models.holdings;
    const companyModel = models.companies;
    
    await userModel.bulkCreate([{
        "firstName": "Antonetta",
        "lastName": "Kester",
        "userName": "akester0",
        "portfolioId": 1
      }, {
        "firstName": "Sascha",
        "lastName": "Bartel",
        "userName": "sbartel1",
        "portfolioId": 2
      }, {
        "firstName": "Annmarie",
        "lastName": "Mandres",
        "userName": "amandres2",
        "portfolioId": 3
      }, {
        "firstName": "Twila",
        "lastName": "Turrill",
        "userName": "tturrill3",
        "portfolioId": 4
      }, {
        "firstName": "Mary",
        "lastName": "Othen",
        "userName": "mothen4",
        "portfolioId": 5
      }]);
      await portfolioModel.bulkCreate([{
        "userId": 1,
        "balance": 32500
      },
      {
        "userId": 2,
        "balance": 1865000
      },{
        "userId": 3,
        "balance": 14300
      },{
        "userId": 4,
        "balance": 84750
      },{
        "userId": 5,
        "balance": 374000
      }]);
    await companyModel.bulkCreate(
        [{
            "legalName": "Linklinks",
            "shareSymbol": "HCI",
            "shareQuantity": 233347954,
            "sharePrice": 12.50
          }, {
            "legalName": "Abata",
            "shareSymbol": "WDC",
            "shareQuantity": 56702953,
            "sharePrice": 84.00
          }, {
            "legalName": "Yodoo",
            "shareSymbol": "FLW",
            "shareQuantity": 266094283,
            "sharePrice": 9.70
          }, {
            "legalName": "Innojam",
            "shareSymbol": "FVU",
            "shareQuantity": 52599023,
            "sharePrice": 155.00
          }, {
            "legalName": "Yodo",
            "shareSymbol": "ANW",
            "shareQuantity": 480394294,
            "sharePrice": 35.50
          }]
    );
    await tradeModel.bulkCreate(
      [{
        "requesterId": 1,
        "requesterType": "company",
        "shareSymbol": "HCI",
        "transactionType": "sell",
        "quantity": 233347954,
        "price": 12.50
      },{
        "requesterId": 2,
        "requesterType": "company",
        "shareSymbol": "WDC",
        "transactionType": "sell",
        "quantity": 56702953,
        "price": 84.00
      },{
        "requesterId": 3,
        "requesterType": "company",
        "shareSymbol": "FLW",
        "transactionType": "sell",
        "quantity": 266094283,
        "price": 9.70
      },{
        "requesterId": 4,
        "requesterType": "company",
        "shareSymbol": "FVU",
        "transactionType": "sell",
        "quantity": 52599023,
        "price": 155.00
      },{
        "requesterId": 5,
        "requesterType": "company",
        "shareSymbol": "ANW",
        "transactionType": "sell",
        "quantity": 480394294,
        "price": 35.50
      },]
    )
}