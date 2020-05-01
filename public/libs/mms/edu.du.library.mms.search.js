MMS.namespace("MMS.search");

MMS.search = (function($) {

    "use strict";

    var doQuickSearch,
        spellCheck,
        term,
        searchString,
        didYouMeanSearch,
        didYouMeanTerm,
        displaySearchResponse,
        requestObj,
        init,
        viewObj,
        error = "<h4 class='alert_error'>The search server is currently not available.  Please contact library-support@du.edu for assistance.</h4>";


    viewObj = {
        content: 'search-results',
        articleID: 'search-forms',
        articleClass: 'module width_3_quarter', /* module width_full */
        h3ID: 'null',
        h3Value: '',
        formID: 'search-form',
        divID: 'search',
        divClass: 'tab_container',
        header: '<div class="pagination"></div>',
        footer: '<div class="pagination"></div>'
    };

    /**
     * performs a quick search
     * @param event
     */
    doQuickSearch = function(event) {

        $("#content").empty();

        event.preventDefault();

        term = $("input#quickSearch").val();
        term = MMS.utils.sanitizeInput(term);

        if (term === "") {
            return $("#actionFeedback").html("<h4 class='alert_error'>Please enter a search term</h4>");
        }

        searchString = $("#search_box").serialize();

        $("#search").empty();
        $("#actionFeedback").empty();

        requestObj = {
            type: "GET",
            url: MMS.configObj.search,
            data: $("#search_box").serialize(),
            dataType: "json",
            cache: true,
            success: function (response) {

                if (response.error == 500) {
                    $("#error").html(error);
                } else {
                    $("#error").html("");
                    MMS.view.createView(viewObj);
                    displaySearchResponse(response);
                }
            }
        };

        MMS.utils.doAjax(requestObj);

        return false;
    };

    /**
     * parses and displays search response
     * @param responseObj
     */
    displaySearchResponse = function(responseObj) {

        var results = "";
        var paginationArr = [];
        var page = "";
        var profileObj = JSON.parse(sessionStorage.getItem("mms_profile"));

        //if (term.trim().indexOf(' ') === -1) {
            //spellCheck(responseObj);
        //}

        $("#search_box")[0].reset();
        $("#search-message").text("You searched for: " + term);
        $(".current").html("Search Results");

        if (responseObj.total === 0) {
            $("#search-forms").remove();
            $("div#actionFeedback").empty().append("<h4 class='alert_info'>No Results Found.</h4>");
            return;
        }

        results += "<div>";
        results += "<div>";
        results += "<table class='tablesorter' cellspacing='0'>";
        results += "<thead>";
        results += "<tr>";
        results += "<th>Records Found: " + responseObj.total + "</th>";
        results += "<th>Actions</th>";
        results += "</tr>";
        results += "</thead>";
        results += "<tbody id='pages'>";

        $.each(responseObj.hits, function(key, data) {

            let value = data._source;

            page += "<tr>";
            page += "<td width='85%'>";
            page += "<table width='85%' style='border-bottom: 1px dotted #ccc;'>";
            page += "<tr align='top'>";
            page += "<td width='40%' align='left'>";

            if (value.title_t !== undefined) {
                page += "<p><strong>Title:</strong> " + value.title_t[0] + "</p>";
            }

            if (value.identifier_t !== undefined) {
                for (var i=0;i<value.identifier_t.length;i++) {
                    page += "<p><strong>Identifier:</strong> " + value.identifier_t[i] + "</p>";
                }
            }

            page += "</td>";
            page += "</tr>";
            page += "</table>";
            page += "</td>";
            page += "<td width='28%'>";
            page += "<input type='image' src='../../images/icn_edit.png' title='Edit' onclick='MMS.metadata.getMetadata(event, \"" + value.pid_t + "\", \"search\");'>";

            if (profileObj.roleID === 1) {
                page += "<input type='image' src='../../images/icn_trash.png' title='Trash' onclick='MMS.metadata.deleteMetadata(event, \"" + value.pid_t + "\"); return false;'>";
            }

            page += "</td>";
            page += "</tr>";
            paginationArr.push(page);
            page = "";

        });

        results += "</tbody>";
        results += "</table>";
        results += "</div>";
        results += "</div>";

        $("#search").append(results);
        $("#search-results").show();

        MMS.pagination.init(paginationArr);
    };

    /** NOT USED...causes performance issues at server level
     * suggest a correct spelling of a search term
     * @param responseObj
     */
    spellCheck = function(responseObj) {

        var correctSpelling;

        $.each(responseObj.spellcheck.suggestions, function(key, value) {

            if (value !== "true") {
                if (value.suggestion !== undefined) {
                    $.each(value.suggestion, function(key, value) {
                        if (key === 0) {
                            didYouMeanTerm = value.word.trim();
                            correctSpelling = "<a href='#' id='didYouMeanSearch'>" + value.word.trim() + "</a>";
                        }

                    });
                }
            }
        });

        if (correctSpelling !== undefined) {
            $("#searchActionFeedback").html("<h4 class='alert_warning'>Did you mean: " + correctSpelling + "</h4>");
            $("#didYouMeanSearch").on("click", function(event) {
                didYouMeanSearch();
            });
        }
    };

    /** NOT USED
     * executes a search using the "did you mean" term
     */
    didYouMeanSearch = function() {

        $("#search").empty();
        $("#searchActionFeedback").empty();

        var newSearchString = searchString.replace(term, didYouMeanTerm);
        term = didYouMeanTerm;

        requestObj = {
            type: "GET",
            url: MMS.configObj.search,
            data: newSearchString,
            dataType: "json",
            cache: true,
            success: function (response) {

                if (response.error == 500) {
                    $("#error").html(error);
                } else {
                    $("#error").html("");
                    displaySearchResponse(response);
                }
            }
        };

        MMS.utils.doAjax(requestObj);
    }

    /**
     * binds events to HTML elements
     */
    init = function() {

        $("#search-forms").hide();
        $("form.quick_search").submit(function(event) {
            doQuickSearch(event);
        });
    };

    return {
        init:function() {
            return init();
        }
    };

}(jQuery));