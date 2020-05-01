MMS.namespace("MMS.view");

MMS.view = (function($) {

    "use strict";

    var createView;

    createView = function(viewObj) {

        var view = '';
        view += '<div id="actionFeedback"></div>';
        view += '<div id="error"></div>';
        view += '<article id="' + viewObj.articleID + '" class="' + viewObj.articleClass + '">';
        view += '<header>';

        if (viewObj.h3ID !== 'null') {
            view += '<h3 id="' + viewObj.h3ID + '">' + viewObj.h3Value + '</h3>';
        }

        if (viewObj.header !== 'null') {
            view += viewObj.header;
        }

        view += '</header>';
        view += '<form id="' + viewObj.formID + '">';
        view += '<div id="' + viewObj.divID + '" class="' + viewObj.divClass + '"></div>';
        view += '<footer>';

        if (viewObj.footer !== 'null') {
            view += viewObj.footer;
        }

        view += '</footer>';
        view += '</form>';
        view += '</article>';

        $("#" + viewObj.content).empty().append(view);

    }

    return {
        createView: function(viewObj) {
            createView(viewObj);
        }
    };

}(jQuery));
