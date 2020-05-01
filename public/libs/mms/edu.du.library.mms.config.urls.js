$(function() {

    MMS.configObj = MMS.configObj || {};

    /*
    if (document.domain === "mms.library.du.edu") {
        MMS.configObj.sslBaseUrl = "https://" + document.domain + "/dsp/";
        MMS.configObj.baseUrl = "http://" + document.domain + "/dsp/";
    } else if (document.domain === "lib-devmms.cair.du.edu") {
        MMS.configObj.sslBaseUrl = "https://" + document.domain + "/dsp/";
        MMS.configObj.baseUrl = "http://" + document.domain + "/dsp/";
    } else if (document.domain === "lib.dev") {
        MMS.configObj.sslBaseUrl = "https://" + document.domain + "/dsp/";
        MMS.configObj.baseUrl = "http://" + document.domain + "/dsp/";
    }
    */

    // MMS.configObj.authenticate = MMS.configObj.sslBaseUrl + "index.php/admin/login";
    // MMS.configObj.utils = MMS.configObj.sslBaseUrl + "index.php/utils/utils/ping_services";
    MMS.configObj.logout = MMS.configObj.baseUrl + "index.php/admin/login/logout";
    // MMS.configObj.dashboard = MMS.configObj.baseUrl + "index.php/admin/dashboard";
    // MMS.configObj.vocabUrl = MMS.configObj.baseUrl + "index.php/admin/controlled_vocabularies";
    // MMS.configObj.uploadUrl = MMS.configObj.baseUrl + "libs/plupload/upload.html";
    // MMS.configObj.xmlUploadUrl = MMS.configObj.baseUrl + "libs/plupload/uploadXml.html";
    // MMS.configObj.roles = MMS.configObj.baseUrl + "index.php/admin/roles";
    MMS.configObj.users = MMS.configObj.baseUrl + "index.php/admin/users";
    // MMS.configObj.collections = MMS.configObj.baseUrl + "index.php/admin/collections";
    // MMS.configObj.ingest = MMS.configObj.baseUrl + "index.php/admin/ingest";
    // MMS.configObj.search = MMS.configObj.baseUrl + "index.php/admin/search";
    MMS.configObj.repository = MMS.configObj.baseUrl + "index.php/admin/repository";
    MMS.configObj.objectTypes = MMS.configObj.baseUrl + "index.php/admin/object_types";
    MMS.configObj.batch = MMS.configObj.baseUrl + "index.php/admin/batch";
    // MMS.configObj.xml = MMS.configObj.baseUrl + "index.php/admin/xml";
    MMS.configObj.nas = MMS.configObj.baseUrl + "index.php/admin/nas?object=";
    // MMS.configObj.queue = MMS.configObj.baseUrl + "index.php/admin/queue";

    MMS.configObj.dashboard = 'http://' + document.domain + ':3005/dsp/dashboard';
    MMS.configObj.authenticate = 'http://' + document.domain + ':3005/api/v2/dsp/authenticate';
    MMS.configObj.profile = 'http://' + document.domain + ':3005/api/v2/dsp/profile';
    MMS.configObj.repository = 'http://' + document.domain + ':3005/api/v2/dsp/metadata';
    MMS.configObj.uploadUrl = 'http://' + document.domain + ':3005/libs/plupload/upload.html';
    MMS.configObj.xmlUploadUrl = 'http://' + document.domain + ':3005/libs/plupload/uploadXml.html';
    MMS.configObj.search = 'http://' + document.domain + ':3005/api/v3/search';
});
