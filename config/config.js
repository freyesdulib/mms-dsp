'use strict';

module.exports = {
    host: process.env.HOST,
    elasticSearch: process.env.ELASTIC_SEARCH,
    requestOrigin: process.env.REQUEST_ORIGIN,
    ldap: process.env.LDAP,
    dspHost: process.env.DSP_HOST,
    dspUser: process.env.DSP_USER,
    dspPassword: process.env.DSP_PASSWORD,
    dspDB: process.env.DSP_DB,
    nasPath: process.env.NAS_PATH,
    tokenSecret: process.env.TOKEN_SECRET,
    tokenAlgo: process.env.TOKEN_ALGO,
    tokenExpires: process.env.TOKEN_EXPIRES,
    tokenIssuer: process.env.TOKEN_ISSUER,
    salt: process.env.SALT
};
