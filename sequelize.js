const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

let database;
let dbmodels;

const importModels = (modelsDirection) => {
  fs.readdirSync(modelsDirection).forEach(function(filename) {
    var model = {};
    model.path = path.join(__dirname, modelsDirection, filename)
    model.name = filename
    model.resource = database.import(model.path);
  });
};


module.exports.start = async (config) => {
    database = new Sequelize(config.name, config.user, config.password, {
        host: config.host,
        port: config.port,
        dialect: config.dialect,
        logging: (msg) => {
          console.log(msg);
        }
      });
    importModels(config.modelsDirection);
    dbmodels = database.models;
    require(`${__dirname}/${config.relationDirection}`)(database.models);
    await database.sync({force: true});
    await require(`${__dirname}/${config.mockDataMigrationDirection}`)(database.models);
};

module.exports.models = () => dbmodels;