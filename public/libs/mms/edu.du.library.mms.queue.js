MMS.namespace("MMS.queue");

MMS.queue = (function($) {

    "use strict";

    var viewObj,
        getItems,
        requestObj,
        listItems;

    viewObj = {
        content: 'content',
        articleID: 'queue-forms',
        articleClass: 'module width_full',
        h3ID: 'null',
        h3Value: '',
        formID: 'queue-form',
        divID: 'queue',
        divClass: 'module_content',
        header: 'null',
        footer: 'null'
    };

    /**
     * retrieves queue items
     * @return void
     */
    getItems = function() {

        requestObj = {
            type: "GET",
            url: MMS.configObj.queue,
            dataType: "json",
            cache: false,
            success: function (response) {
                listItems(response);
            }
        };

        MMS.utils.doAjax(requestObj);

        return false;
    };

    /**
     * lists queue items
     * @param response
     * @return void
     */
    listItems = function(response) {

        $(".current").html("Review Queue");
        $("#search-results").empty();

        MMS.view.createView(viewObj);

        if (response.length === 0) {
            $("#queue-forms").remove();
            $("div#actionFeedback").empty().append("<h4 class='alert_info'>There are no items in queue.</h4>");
            return;
        }

        var itemsResponse = "";
        itemsResponse += "<div class='tab_container'>";
        itemsResponse += "<div id='tab1' class='tab_content'>";
        itemsResponse += "<table class='tablesorter' cellspacing='0'>";
        itemsResponse += "<thead>";
        itemsResponse += "<tr>";
        itemsResponse += "<th>Pid</th>";
        itemsResponse += "<th>Title</th>";
        itemsResponse += "<th>Created By</th>";
        itemsResponse += "<th>Date Created</th>";
        itemsResponse += "<th>Actions</th>";
        itemsResponse += "</tr>";
        itemsResponse += "</thead>";
        itemsResponse += "<tbody>";

        $.each(response, function(key, value) {

            itemsResponse += "<tr>";
            itemsResponse += "<td>" + value.pid + "</td>";
            itemsResponse += "<td>" + value.title + "</td>";
            itemsResponse += "<td>" + value.name + "</td>";
            itemsResponse += "<td>" + value.timestamp + "</td>";
            itemsResponse += "<td width='28%'><input type='image' src='../../images/icn_edit.png' title='Edit' onclick='MMS.metadata.getMetadata(event, \"" + value.pid + "\", \"queue\");'</td>";
            // ><input type='image' src='../../images/icn_trash.png' title='Trash' onclick='MMS.queue.deleteItem(event, \"" + value.queueID + "\"); return false;'>
            itemsResponse += "</tr>";

        });

        itemsResponse += "</tbody>";
        itemsResponse += "</table>";
        itemsResponse += "</div>";
        itemsResponse += "</div>";

        $('#search-results').empty();
        $('#queue').append(itemsResponse);

    };

    return {
        getItems: function() {
            getItems();
        }
    };

}(jQuery));
