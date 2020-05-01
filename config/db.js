var config = require('../config/config'),
    db = require('knex')({
        client: 'mysql2',
        connection: {
            host     : config.dspHost,
            user     : config.dspUser,
            password : config.dspPassword,
            database : config.dspDB
        },
        pool: {
            min: 1,
            max: 5
        }
    });

module.exports = function () {
    return db;
};