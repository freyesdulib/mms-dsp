'use strict';

var Indexer = require('../indexer/controller');

module.exports = function (app) {

    app.route('/api/v2/dsp/index')
        .post(Indexer.indexDsp);

    app.route('/api/v2/dsp/create')
        .post(Indexer.createDspIndex);

    app.route('/api/v3/full-index')
        .post(Indexer.fullIndex);
};