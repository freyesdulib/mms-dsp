MMS.namespace("MMS.nas");

MMS.nas = (function($) {

    // ** dependencies ** //

    "use strict";

    var getFileNames,
        displayFileNames,
        requestObj,
        saveFile,
        viewObj,
        createUploadArea,
        init;

    viewObj = {
        content: 'content',
        articleID: 'nas-forms',
        articleClass: 'module width_3_quarter',
        h3ID: 'null',
        h3Value: '',
        formID: 'nas-form',
        divID: 'nas',
        divClass: 'module_content',
        header: 'null',
        footer: 'null'
    };

    /**
     * constructs Edit User form fields
     */
    getFileNames = function() {

        requestObj = {
            type: "GET",
            url: MMS.configObj.nas,
            dataType: "json",
            cache: true,
            success: function (response) {
                MMS.view.createView(viewObj);
                displayFilesNames(response);
            }
        };

        MMS.utils.doAjax(requestObj);
    };

    /**
     * displays xml file names
     * @param response
     */
    displayFileNames = function(response) {

        $(".current").html("File");

        var files = "";
        files += "<div class='tab_container'>";
        files += "<div id='tab1' class='tab_content'>";
        files += "<table class='tablesorter' cellspacing='0'>";
        files += "<thead>";
        files += "<tr>";
        files += "<th>File</th>";
        files += "<th>Actions</th>";
        files += "</tr>";
        files += "</thead>";
        files += "<tbody>";

        $.each(response, function(key, value) {

            files += "<input name='files[]' type='hidden' value='" + value.fileName + "' />";
            files += "<tr>";
            files += "<td>" + value.fileName + "</td>";
            files += "<td><input type='image' src='../../images/icn_trash.png' title='Trash' onclick='MMS.user.deleteFile(\"" + value.fileName + "\"); return false;'></td>";
            files += "</tr>";
            // <input type='image' src='../../images/icn_edit.png' title='Edit' onclick='MMS.xml.getXml(\"" + value.fileName + "\");return false;'>

        });

        files += "</tbody>";
        files += "</table>";
        files += "</div>";
        files += "</div>";

        $("#xml").append(files);
        $("#xml-forms").show();

    };

    /**
     *  sends xml to server
     */
    saveFile = function(file) {

        var files = [];

        for (var i in file) {
            files.push(file[i].name);
        }

        sessionStorage.setItem('dsp_uploads', JSON.stringify(files));

        requestObj = {
            type: "POST",
            url: MMS.configObj.nas,
            data: {'files': files},
            dataType: "json",
            cache: false,
            success: function (response) {

                $("#nas-forms").remove();

                if (response.uploaded !== 'false') {

                    $("div#actionFeedback").empty().append("<h4 class='alert_success'>File(s) imported.</h4>");

                    setTimeout(function() {
                        $("div#actionFeedback").empty();
                        MMS.metadata.loadForm();
                    }, 3000);
                } else {
                    var message = "<p>The file(s) failed to import</p>";
                    $("div#actionFeedback").empty().append("<h4 class='alert_error'>" + message + "</h4>");
                }

                location.hash = "#header";
            }
        };



        MMS.utils.doAjax(requestObj);
    };

    /**
     * creates drag and drop upload area
     */
    createUploadArea = function() {

        MMS.view.createView(viewObj);

        requestObj = {
            type: "GET",
            url: MMS.configObj.uploadUrl,
            dataType: "html",
            cache: false,
            success: function (response) {
                $("#nas").append(response);
            }
        };

        MMS.utils.doAjax(requestObj);
    };

    /**
     * Hides form and binds load form event when dashboard is loaded
     */
    init = function() {

        $("#view_files").on("click", function() {
            getFileNames();
        });
    };

    return {
        init:function() {
            return init();
        },
        saveFile:function(file) {
            return saveFile(file);
        },
        createUploadArea:function() {
            return createUploadArea();
        }
    };

}(jQuery));