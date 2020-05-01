MMS.namespace("MMS.pagination");

MMS.pagination = (function($) {

    "use strict";

    var pages,
        currentPage = 1,
        pageCount,
        recordsPerPage = 4,
        renderPagingControls,
        renderPage,
        recordCount,
        pagination,
        next,
        previous,
        init;

    /**
     * calculates the page count
     */
    pageCount = function() {
        return Math.ceil(recordCount/recordsPerPage);
    };

    /**
     * renders page controls
     */
    renderPagingControls = function() {

        $("div.pagination").empty();

        var pagingControls = "";
        pagingControls += "<ul id='pagination-flickr'>";
        pagingControls += "<li><a href='#' onclick='MMS.pagination.previous(" + currentPage + ")'>Previous</a></li>";

        for (var i=1; i<=pageCount(); i++) {

            if (i !== currentPage) {

                if (pageCount() <= 20 ) {
                    pagingControls += "<li><a href='#' onclick='MMS.pagination.renderPage(" + i + "); return false;'>" + i + "</a></li>";
                //} else if (pageCount() > 20) {
                    //pagingControls += "<li><a href='#' onclick='MMS.pagination.renderPage(" + i + "); return false;'>" + i + "</a></li>";
                }

            } else {
                pagingControls += "<li class='active'>" + i + "</li>";
                currentPage = i;
            }
        }
        pagingControls += "<li><a href='#' onclick='MMS.pagination.next(" + currentPage + ")'>Next</a></li>";
        pagingControls += "</ul>";

        $("div.pagination").append(pagingControls);
    };

    /**
     * moves to the next page
     * @param current
     */
    next = function(current) {

        if (current < pageCount()) {
            var nextPage = current + 1;
            renderPage(nextPage);
        }
    };

    /**
     * moves to the previous page
     * @param current
     */
    previous = function(current) {

        if (current > 1) {
            var previousPage = current -1;
            renderPage(previousPage);
        }
    };

    /**
     * displays current page
     * @param page
     */
    renderPage = function(page) {

        currentPage = page;
        var page = (page-1);
        renderPagingControls();

        $("#pages").empty();
        for (var i = (page)*recordsPerPage; i < ((page)*recordsPerPage) + recordsPerPage; i++) {
            $("#pages").append(pages[i]);
        }

    };

    /**
     * initializes pagination method
     * param @paginationArr
     */
    init = function(paginationArr) {

        pages = paginationArr;
        recordCount = paginationArr.length;
        renderPage(1);

    }

    return {
        init:function(paginationArr) {
            return init(paginationArr);
        },
        renderPage:function(page) {
            return renderPage(page);
        },
        next:function(page) {
            return next(page);
        },
        previous:function(page) {
            return previous(page);
        }
    };

}(jQuery));