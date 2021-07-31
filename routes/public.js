module.exports = (app) => {
  app.use('/trade', require('../controllers/public/tradeController'));
  app.use('/user', require('../controllers/public/userController'));
  app.use('/company', require('../controllers/public/companyController'));
};
