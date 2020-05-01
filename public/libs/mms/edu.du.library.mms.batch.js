MMS.namespace("MMS.batch");

MMS.batch = (function($) {

    "use strict";

    var getBatchFilesAndMetadata,
        displayBachFileRecords,
        ingest,
        requestObj,
        viewObj,
        init;

    viewObj = {
        content: 'content',
        articleID: 'batch-ingest-forms',
        articleClass: 'module width_full',
        h3ID: 'null',
        h3Value: '',
        formID: 'batch-ingest-form',
        divID: 'batch-ingest',
        divClass: 'module_content',
        header: '<div class="submit_link"><input class="ingest" type="button" onclick="MMS.batch.ingest();" value="Expose records"></div>',
        footer: '<div class="submit_link"><input class="ingest" type="button" onclick="MMS.batch.ingest();" value="Expose records"></div>'
    };

    /**
     * retrieves objects and metadata
     */
    getBatchFilesAndMetadata = function() {

        MMS.utils.focusForm("#batch-ingest-forms");

        requestObj = {
            type: "GET",
            url: MMS.configObj.batch,
            dataType: "json",
            cache: true,
            success: function (response) {
                MMS.view.createView(viewObj);
                displayBachFileRecords(response);
            }
        };

        MMS.utils.doAjax(requestObj);

        return false;
    };

    /**
     * displays batch records
     * @param response
     */
    displayBachFileRecords = function(response) {

        $(".current").html("Batch");

        if (response.length === 0) {
            $("#batch-ingest-forms").remove();
            $("div#actionFeedback").empty().append("<h4 class='alert_info'>There are no records to process.</h4>");
            return;
        }

        var results = "";
        results += "<div>";
        results += "<div>";
        results += "<table class='tablesorter' cellspacing='0'>";
        results += "<thead>";
        results += "<tr>";
        results += "<th>Batch Records</th>";
        results += "<th>Status</th>";
        results += "</tr>";
        results += "</thead>";
        results += "<tbody>";

        $.each(response, function(key, value) {

            if (value.object != "") {
                results += "<input name='pids[]' type='hidden' value='" + value.pid + "' />";
            }

            results += "<tr>";
            results += "<td width='85%'>";
            results += "<table width='85%' style='border-bottom: 1px dotted #ccc;'>";
            results += "<tr align='top'>";
            results += "<td width='40%' align='left'>";
            results += "<p><strong>Pid:</strong> " + value.pid + "</p>";
            results += "<p><strong>Title:</strong> " + value.title + "</p>";
            results += "<p><strong>Type:</strong> " + value.type + "</p>";

            for (var i=0;i<value.identifier.length;i++) {
                results += "<p><strong>Identifier:</strong> " + value.identifier[i] + "</p>";
            }

            results += "</td>";
            results += "</tr>";
            results += "</table>";
            results += "</td>";

            //results += "<td width='28%'>ready.</td>";

            if (value.object != "") {
                results += "<td width='28%'>complete.</td>";
            } else {
                results += "<td width='28%'>incomplete. (The object was not found on the storage server)</td>";
            }

            results += "</tr>";

        });

        results += "</tbody>";
        results += "</table>";
        results += "</div>";
        results += "</div>";

        $("#batch-ingest").empty().append(results);
        $("#batch-ingest-forms").show();

    };

    /**
     * batch ingest
     */
    ingest = function() {

        requestObj = {

            type: "POST",
            url: MMS.configObj.batch,
            data: $("#batch-ingest-form").serialize(),
            dataType: "json",
            cache: false,
            success: function (response) {

                if (response.success === false) {
                    $("div#actionFeedback").empty().append("<h4 class='alert_info'>Only complete records are processed.</h4>");
                    setTimeout(function(){ $("div#actionFeedback").empty(); }, 4000);
                } else {

                    $("#batch-ingest").empty();
                    $("#batch-ingest-forms").remove();
                    $("div#actionFeedback").empty().append("<h4 class='alert_info'>Records processing complete.</h4>");
                    setTimeout(function(){ $("div#actionFeedback").empty(); }, 4000);

                }
            }
        };

        MMS.utils.doAjax(requestObj);

        return false;
    };

    init = function() {

        $("#batch-ingest-forms").hide();

        $("#batch").on("click", function(event) {
            getBatchFilesAndMetadata($(this).attr("id"));
        });

    };

    return {
        init:function() {
            return init();
        },
        ingest:function() {
            return ingest();
        }
    };

}(jQuery));
