MMS.namespace("MMS.utils");

MMS.utils = (function($) {

    "use strict";

    var doAjax,
        focusForm,
        pingServices,
        viewObj,
        sanitizeInput;

    viewObj = {
        content: 'content',
        articleID: 'null',
        articleClass: 'null',
        h3ID: 'null',
        h3Value: '',
        formID: 'null',
        divID: 'null',
        divClass: 'null',
        header: 'null',
        footer: 'null'
    };

    /**
     * makes the ajax request
     * @param object requestObj
     */
    doAjax = function(requestObj) {

        requestObj.timeout = 60000;  // 60 sec.
        requestObj.error = function ( textStatus, errorThrown ) {
                               $("#error").html("<h4 class='alert_error'>An error has occurred (" + errorThrown + ").  Please contact library-support@du.edu for assistance.</h4>");
                            };
        requestObj.statusCode =  {
                                    403: function() {
                                        alert("Session expired");
                                        MMS.view.createView(viewObj);
                                        $("#actionFeedback").html("<h4 class='alert_error'>Your session has expired.  You will be redirected to the login form momentarily.</h4>");
                                        setTimeout(function() {
                                            window.location = MMS.configObj.sslBaseUrl;
                                        }, 7000);
                                    }
                                 };

        $(document).ajaxStart(function() {
            $.fancybox.showLoading();
        });

        $(document).ajaxStop(function() {
            $.fancybox.hideLoading();
        });

        $.ajax(requestObj);
    };

    /**
     * checks if Fedora & Solr are available
     */
    pingServices = function() {

        var requestObj = {
            type: "GET",
            url: MMS.configObj.utils,
            dataType: "json",
            cache: false,
            success: function (response) {

                if (typeof response === null || response.isFedoraUp !== 200 || response.isSolrUp !== 'OK') {
                    $("#error").html("<h4 class='alert_error'>Some services are currently not available. Please contact library-support@du.edu for assistance.</h4>");
                    $("#authenticate").attr("disabled", "disabled");
                }
            }
        };

        doAjax(requestObj);
    };

    /**
     * removes tags from input
     * @param value
     */
    sanitizeInput = function(value) {
        return value.replace(/</g, "").replace(/>/g, "");
    };

    /** NOT-USED
     * hides all article blocks except the one specified
     * @param id
     */
    focusForm = function(id) {

        if (id !== "#metadata-forms") {
            $(".optional_fields").hide();
            $("#optional_fields").hide();
        }

        $("article:not(" + id + ", .breadcrumbs)").hide();
    }

    return {
        doAjax: function(requestObj) {
            doAjax(requestObj);
        },
        focusForm: function(id) {
            focusForm(id);
        },
        sanitizeInput: function(value) {
            return sanitizeInput(value);
        },
        pingServices: function() {
            pingServices();
        }
    };

}(jQuery));
