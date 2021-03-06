'use strict';

const config = require('../config/config.js'),
    es = require('elasticsearch'),
    logger = require('../libs/log4'),
    client = new es.Client({
        host: config.elasticSearch
    });

/**
 * Performs full text search
 * @param req
 * @param callback
 */
exports.search = function (req, callback) {

    if (req.query.keyword === undefined) {  // || req.query.options === undefined

        callback({
            status: 400,
            message: 'Bad Request.'
        });

        return false;
    }

    let options = req.query.options;
    let q = req.query.keyword.replace('mms:', '');
    let match = q;

    q = {
        'query': {
            'match' : {
                '_all' : match
            }
        }
    };

    client.search({
        from: 0,
        size: 500,
        index: 'mms_dsp',
        type: 'data',
        body: q
    }).then(function (body) {

        callback({
            status: 200,
            data: body.hits
        });

    }, function (error) {
        logger.module().error('ERROR: unable to get search results ' + error);
        callback(error);
    });
};