'use strict';

var Indexer = require('../indexer/service');

exports.indexDsp = function (req, res) {
    Indexer.indexDsp(req, function (data) {
        res.status(data.status).send(data.data);
    });
};

exports.createDspIndex = function (req, res) {
    Indexer.createDspIndex(req, function (data) {
        res.status(data.status).send(data.data);
    });
};

exports.fullIndex = function (req, res) {
    Indexer.fullIndex(req, function (data) {
        res.status(data.status).send(data.data);
    });
};

exports.deleteIndex = function (req, res) {
    Indexer.deleteIndex(req, function (data) {
        res.status(data.status).send(data.data);
    });
};

exports.createIndex = function (req, res) {
    Indexer.createIndex(req, function (data) {
        res.status(data.status).send(data.data);
    });
};

exports.createMapping = function (req, res) {
    Indexer.createMapping(req, function (data) {
        res.status(data.status).send(data.data);
    });
};