'use strict';

const CONTROLLER = require('../metadata/controller'),
    TOKEN = require('../libs/tokens');

module.exports = function (app) {

    app.route('/api/v2/dsp/metadata')
        .get(CONTROLLER.get_metadata)
        .post(TOKEN.verify, CONTROLLER.save_metadata)
        .put(CONTROLLER.update_metadata)
        .delete(CONTROLLER.delete_metadata);

    app.route('/api/v2/dsp/convert')
        .get(CONTROLLER.convert);

    /*
    app.route('/api/v2/dsp/batch')
        .get(CONTROLLER.get_batch_records)
        .post(CONTROLLER.publish_batch_records);

    app.route('/api/v2/nas')
        .get(CONTROLLER.get_nas_object);


        */
};