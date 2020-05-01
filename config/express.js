'use strict';

var http = require('http'),
    express = require('express'),
    compress = require('compression'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    helmet = require('helmet'),
    cors = require('cors');

module.exports = function () {

    var app = express(),
        server = http.createServer(app);

    if (process.env.NODE_ENV === 'development') {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
    } else if (process.env.NODE_ENV === 'production') {
        app.use(compress());
    }

    app.use(cors());
    app.options('*', cors());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(express.static('./public'));
    app.set('views', './views');
    app.set('view engine', 'ejs');
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(helmet());

    require('../indexer/routes')(app);
    require('../auth/routes')(app);
    require('../search/routes')(app);
    require('../dashboard/routes')(app);
    require('../metadata/routes')(app);

    return server;
};