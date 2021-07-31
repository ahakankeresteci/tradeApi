module.exports = {
    database: {
        name: 'eva',
        user: 'root',
        password: '12345',
        host: 'localhost',
        port: '3306',
        dialect: 'mysql',
        modelsDirection: 'db/models/',
        relationDirection: 'db/relations',
        mockDataMigrationDirection: 'db/mockDataMigration'
    },
    port: 3000
};