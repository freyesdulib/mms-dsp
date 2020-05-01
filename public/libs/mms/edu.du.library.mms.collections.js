MMS.namespace("MMS.collections");

MMS.collections = (function($) {

    // ** dependencies ** //
    // MMS.utils
    // MMS.ui
    // MMS.configObj
    // http://ajax.aspnetcdn.com/ajax/jquery.validate/1.9/jquery.validate.min.js

    "use strict";

    var collection = "#collection",
        collectionForm = "#collection-form",
        collectionForms = "#collection-forms",
        constructCollectionFields,
        constructEditCollectionFields,
        validate,
        loadForm,
        init,
        saveCollectionData,
        requestObj,
        viewObj;

    viewObj = {
        content: 'content',
        articleID: 'collection-forms',
        articleClass: 'module width_full',
        h3ID: 'null',
        h3Value: '',
        formID: 'collection-form',
        divID: 'collection',
        divClass: 'module_content',
        header: 'null',
        footer: '<div class="submit_link"><input type="submit" value="Save"></div>'
    };

    /** TODO: change method name
     * constructs collection form fields
     */
    constructCollectionFields = function() {

        MMS.view.createView(viewObj);

        var fields = "";
        var title = "";
        var description = "";
        var objectType = "";
        var isActive = "";

        // collection name
        title += "<fieldset>";
        title += "<label>";
        title += "* Title";
        title += "</label>";
        title += "<input id='title' name='title' type='text' class='required' />";
        title += "</fieldset>";

        // collection description
        description += "<fieldset>";
        description += "<label>";
        description += "* Description";
        description += "</label>";
        description += "<input id='description' name='description' type='text' class='required' />";
        description += "</fieldset>";

        isActive += "<input id='isActive' name='isActive' type='hidden' value='1' checked />";

        fields += title;
        fields += description;
        fields += isActive;

        $(collection).append(fields);

        // get object Types
        var objectTypeRequestObj = {

            type: "GET",
            url: MMS.configObj.objectTypes,
            dataType: "json",
            cache: true,
            success: function (response) {

                objectType += "<fieldset>";
                objectType += "<label>";
                objectType += "* Object Type";
                objectType += "</label>";
                objectType += "<br />";
                $.each(response, function(key, value) {
                   objectType += "<p><input id='" + value.objectType + "' name='objectType[]' type='checkbox' value='" + value.objectTypeID + "' /> " + value.objectType + "</p>";
                });

                objectType += "</fieldset>";
                $(collection).append(objectType);
            }
        };

        MMS.utils.doAjax(objectTypeRequestObj);

    };


    /**
     * TODO: change method name
     * constructs Edit User form fields
     */
    constructEditCollectionFields = function() {

        MMS.view.createView(viewObj);

        // get collections
        requestObj = {
            type: "GET",
            url: MMS.configObj.collections,
            dataType: "json",
            cache: true,
            success: function (response) {

                var collectionResponse = "";
                collectionResponse += "<div class='tab_container'>";
                collectionResponse += "<div id='tab1' class='tab_content'>";
                collectionResponse += "<table class='tablesorter' cellspacing='0'>";
                collectionResponse += "<thead>";
                collectionResponse += "<tr>";
                collectionResponse += "<th>Collection Name</th>";
                collectionResponse += "<th>Description</th>";
                collectionResponse += "<th>Active</th>";
                collectionResponse += "<th>Actions</th>";
                collectionResponse += "</tr>";
                collectionResponse += "</thead>";
                collectionResponse += "<tbody>";

                $.each(response, function(key, value) {

                    collectionResponse += "<tr>";
                    collectionResponse += "<td>" + value.title + "</td>";
                    collectionResponse += "<td>" + value.description + "</td>";

                    if (value.isActive === "1") {
                        collectionResponse += "<td>Yes</td>";
                    } else {
                        collectionResponse += "<td>No</td>";
                    }

                    //collectionResponse += "<td><input type='image' src='../../images/icn_edit.png' title='Edit'><input type='image' src='../../images/icn_trash.png' title='Trash'></td>";

                    collectionResponse += "<td width='28%'><input type='image' src='../../images/icn_edit.png' title='Edit' onclick='MMS.metadata.getCollections(event, \"" + value.collectionID + "\");'><input type='image' src='../../images/icn_trash.png' title='Trash' onclick='MMS.metadata.deleteCollections(event, \"" + value.collectionID + "\"); return false;'></td>";
                    collectionResponse += "</tr>";

                });

                collectionResponse += "</tbody>";
                collectionResponse += "</table>";
                collectionResponse += "</div>";
                collectionResponse += "</div>";

                $(collection).append(collectionResponse);

            }
        };

        MMS.utils.doAjax(requestObj);

    };

    /**
     * saves collection data
     */
    saveCollectionData = function() {

        requestObj = {
            type: "PUT",
            url: MMS.configObj.collections,
            data: $(collectionForm).serialize(),
            dataType: "json",
            cache: false,
            success: function (response) {
                $(collectionForm)[0].reset();
            }
        };

        MMS.utils.doAjax(requestObj);
    };

    /**
     * loads form based on object type
     */
    loadForm = function(formType) {

        if (formType === "addCollection") {
            constructCollectionFields();
            $(".current").html("Add Collection");
        } else if  (formType === "editCollection") {
            //TODO: build form
        } else if (formType === "deleteCollection") {
            //TODO: build form
        } else if (formType === "viewCollections") {
            constructEditCollectionFields();
            $(".current").html("Collections");
        }
    };

    /**
     * Hides form and binds load form event when dashboard is loaded
     */
    init = function() {

        $(collectionForms).hide();

        $("#addCollection").on("click", function(event) {
            loadForm($(this).attr("id"));
        });

        $("#viewCollections").on("click", function(event) {
            loadForm($(this).attr("id"));
        });

        validate();
    };

    /**
     * validates core form fields
     */
    validate = function() {
        $(collectionForm).validate({
            errorClass: "invalid",
            submitHandler: function() {
                saveCollectionData();
            }
        });
    };

    return {
        init:function() {
            return init();
        }
    };

}(jQuery));
