MMS.namespace("MMS.xml");

MMS.xml = (function($) {

    // ** dependencies ** //

    "use strict";

    var getXMLFileNames,
        displayXmlFilesNames,
        requestObj,
        saveXml,
        viewObj,
        createUploadArea,
        init;

    viewObj = {
        content: 'content',
        articleID: 'xml-forms',
        articleClass: 'module width_3_quarter',
        h3ID: 'null',
        h3Value: '',
        formID: 'xml-form',
        divID: 'xml',
        divClass: 'module_content',
        header: 'null',
        footer: 'null'
    };

    /**
     * constructs Edit User form fields
     */
    getXMLFileNames = function() {

        requestObj = {
            type: "GET",
            url: MMS.configObj.xml,
            dataType: "json",
            cache: true,
            success: function (response) {
                MMS.view.createView(viewObj);
                displayXmlFilesNames(response);
            }
        };

        MMS.utils.doAjax(requestObj);
    };

    /**
     * displays xml file names
     * @param response
     */
    displayXmlFilesNames = function(response) {

        $(".current").html("Xml");

        var xmlFiles = "";
         xmlFiles += "<div class='tab_container'>";
         xmlFiles += "<div id='tab1' class='tab_content'>";
         xmlFiles += "<table class='tablesorter' cellspacing='0'>";
         xmlFiles += "<thead>";
         xmlFiles += "<tr>";
         xmlFiles += "<th>XML File</th>";
         xmlFiles += "<th>Actions</th>";
         xmlFiles += "</tr>";
         xmlFiles += "</thead>";
         xmlFiles += "<tbody>";

        $.each(response, function(key, value) {

            xmlFiles += "<input name='xmlFiles[]' type='hidden' value='" + value.fileName + "' />";
            xmlFiles += "<tr>";
            xmlFiles += "<td>" + value.fileName + "</td>";
            xmlFiles += "<td><input type='image' src='../../images/icn_trash.png' title='Trash' onclick='MMS.user.deleteXmlFile(\"" + value.fileName + "\"); return false;'></td>";
            xmlFiles += "</tr>";
            // <input type='image' src='../../images/icn_edit.png' title='Edit' onclick='MMS.xml.getXml(\"" + value.fileName + "\");return false;'>

        });

        xmlFiles += "</tbody>";
        xmlFiles += "</table>";
        xmlFiles += "</div>";
        xmlFiles += "</div>";

        $("#xml").append(xmlFiles);
        $("#xml-forms").show();

    };

    /**
     *  sends xml to server
     */
    saveXml = function(file) {

        var xmlFiles = [];

        for (var i in file) {
            xmlFiles.push(file[i].name);
        }

        requestObj = {
            type: "PUT",
            url: MMS.configObj.xml,
            data: {'xmlFiles': xmlFiles},
            dataType: "json",
            cache: false,
            success: function (response) {

                $("#xml-forms").remove();

                if (response.created === 'true') {

                    $("div#actionFeedback").empty().append("<h4 class='alert_success'>XML file(s) imported.</h4>");
                    setTimeout(function() {
                        $("div#actionFeedback").empty();
                    }, 5000);
                } else {
                    var message = "<p>The XML file(s) listed below failed to import due to errors:</p>";
                    for (i=0;i<response.length;i++) {
                        message += "<p>" + response[i] + "</p>";
                    }

                    $("div#actionFeedback").empty().append("<h4 class='alert_error'>" + message + "</h4>");
                    //setTimeout(function() {
                    //    $("div#actionFeedback").empty();
                    //}, 5000);
                }

                location.hash = "#header";
            }
        };

        MMS.utils.doAjax(requestObj);
    }

    /**
     * creates drag and drop upload area
     */
    createUploadArea = function() {

        MMS.view.createView(viewObj);

        requestObj = {
            type: "GET",
            url: MMS.configObj.xmlUploadUrl,
            dataType: "html",
            cache: false,
            success: function (response) {
                $("#xml").append(response);
            }
        };

        MMS.utils.doAjax(requestObj);
    };

    /**
     * Hides form and binds load form event when dashboard is loaded
     */
    init = function() {

        $("#view_xml").on("click", function() {
            getXMLFileNames();
        });
    };

    return {
        init:function() {
            return init();
        },
        saveXml:function(file) {
            return saveXml(file);
        },
        createUploadArea:function() {
            return createUploadArea();
        }
    };

}(jQuery));