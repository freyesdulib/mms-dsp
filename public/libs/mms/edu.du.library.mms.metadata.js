MMS.namespace("MMS.metadata");

MMS.counterObj = MMS.counterObj || {};
MMS.counterObj.count = 0;

MMS.metadata = (function ($) {

    // ** dependencies ** //
    // MMS.utils
    // MMS.configObj
    // http://ajax.aspnetcdn.com/ajax/jquery.validate/1.9/jquery.validate.min.js

    "use strict";

    var viewObj,
        createMetadataForm,
        createMetadataEditForm,
        createOptionalElementLinks,
        cloneFieldSet,
        constructFieldEvent,
        metadata = "#metadata",
        metadataForm = "#metadata-form",
        metadataForms = "#metadata-forms",
        constructField,
        $optionalField,
        sortObjects,
        $f,
        $fObj,
        repeatField,
        removeField,
        removeClonedField,
        validate,
        saveMetadata,
        loadForm,
        init,
        requestObj,
        getMetadata,
        deleteMetadata,
        mms_metadata_fields,
        cloneRecord,
        createBackLink,
        back,
        clearField,
        appendOptionalField,
        checkRequiredFields;

    viewObj = {
        content: 'content',
        articleID: 'metadata-forms',
        articleClass: 'module width_3_quarter', /* module width_full */
        h3ID: 'pid',
        h3Value: '',
        formID: 'metadata-form',
        divID: 'metadata',
        divClass: 'module_content',
        header: 'null',
        footer: '<div class="submit_link"><input id="metadata-save-button" type="submit" value="Save"></div>'
    };

    /**
     * constructs the core elements and adds them to the DOM
     * @param objectType
     */
    createMetadataForm = function () {  // objectType

        var sortedFields = sortObjects(mms_metadata_fields, 'displayOrder');

        $.each(sortedFields, function (i, field) {
            $f = constructField(field);
            $f.appendTo(metadata);
        });

        $(metadata).prepend("<input name='objectType' type='hidden' value='ebook'/>");

        // adds filenames from uploaded files to form
        var files = JSON.parse(sessionStorage.getItem('dsp_uploads'));
        sessionStorage.removeItem('dsp_uploads');

        if (files !== null) {

            var size = files.length;

            if (size !== undefined && size > 0) {
                for (var i = 0; i < size; i++) {
                    if (i > 0) {
                        $('<label class="labelTag identifier-' + i + '">' + files[i] + '&nbsp;<span class="remove"><a id="identifier-' + i + '-remove" title="Remove filename" onclick="MMS.metadata.removeClonedField(event, this.id);" href="#"><span>Del</span></a></span></label>').insertAfter('.identifier-0');
                        $('<input id="identifier-' + i + '" class="none " type="hidden" value="' + files[i] + '" name="identifier[]">').insertAfter('.identifier-0');
                    }
                    $('#identifier-' + i).val(files[i]);
                }
            }
        }
    };

    /**
     * returns user to their search results
     * @param type
     * @return link
     */
    createBackLink = function (type) {

        var link;
        var linkMessage;

        $("#search-results").hide();
        linkMessage = "Back to Search Results";
        link = "&nbsp;&nbsp;<a href='#' onclick='MMS.metadata.back(\"" + type + "\");'><img src='../../images/icn_jump_back.png' alt='0' />&nbsp;&nbsp;" + linkMessage + "</a>";

        return link;
    };

    /**
     *
     * @param type
     */
    back = function (type) {

        $("#search-results").show();
        $("#content").empty();
        $("#clone-record").empty();
        $("#controlled-vocabulary-section").hide();

        return false;
    };

    /**
     * constructs metadata edit form
     * @param response
     * @param pid
     */
    createMetadataEditForm = function (response, pid, type) {

        MMS.counterObj.count = 0;
        var editForm = "",
            objectType,
            idClass,
            optionalFields = [];

        $(".current").html("Edit Metadata");
        $(metadata).empty();

        editForm += "<div id='edit-mode'></div>";
        //editForm += '<a id="clone" href="#" title="Copy Record" onclick="MMS.metadata.cloneRecord();"><img src="../../images/icn_new_article.png" alt="Copy Record" border="0">&nbsp;Copy record (' + pid + ')</a>';

        if (type === 'search') {
            editForm += '<input id="type" name="type" type="hidden" value="' + type + '" />';
        }

        mms_metadata_fields = JSON.parse(sessionStorage.getItem("mms_dsp_metadata_fields"));
        var sortedFields = sortObjects(mms_metadata_fields, 'displayOrder');

        $.each(sortedFields, function (i, field) {
            $.each(response, function (key, value) {

                if (field.element === key) {

                    if (typeof value === 'string') {

                        idClass = key.replace(".", "-");
                        idClass = idClass.replace(".", "-");

                        if (field.repeat === 'true' && field.type !== 'select') {

                            editForm += '<fieldset class="' + idClass + '-0">';
                            editForm += '<label>' + field.label + '&nbsp;<span class="clone"><a href="#" id="' + idClass + '-0-clone" onclick="MMS.metadata.constructFieldEvent( event, this.id );" title="Add ' + key + '"><span>Add</span></a></span></label>';

                            if (field.type === 'text') {
                                editForm += '<input id="' + idClass + '-0" name="' + key + '[]" type="text" value="' + value + '" ' + required + ' />';
                            }

                            if (field.type === 'textarea') {
                                editForm += '<textarea id="' + idClass + '-0" name="' + key + '[]" rows="7" cols="55" ' + required + '>' + value + '</textarea>';
                            }

                            editForm += '</fieldset>';

                        } else if (field.repeat === 'false' && field.type !== 'select') {

                            editForm += '<fieldset class="' + idClass + '-0">';
                            editForm += '<label>' + field.label + '</label>';

                            if (field.type === 'text') {
                                editForm += '<input id="' + idClass + '-0" name="' + key + '[]" type="text" value="' + value + '" ' + required + ' />';
                            }

                            if (field.type === 'textarea') {
                                editForm += '<textarea id="' + idClass + '-0" name="' + key + '[]" rows="7" cols="55" ' + required + '>' + value + '</textarea>';
                            }

                            editForm += '</fieldset>';

                        } else if (field.type === 'select') {

                            if (field.required === 'true') {
                                var required = 'class="required"';
                            }

                            editForm += '<fieldset class="' + idClass + '-0">';
                            editForm += '<label>' + field.label + '</label>';
                            //editForm += '<select name="' + field.element + '[]" id="' + field.id + '" ' + required + '"></select>';
                            editForm += '<input id="' + field.id + '" name="' + field.element + '[]" type="text" value="' + value + '" ' + required + ' />';
                            editForm += '</fieldset>';
                        }
                    }

                    if (typeof value === "object") {

                        MMS.counterObj.count = 0;

                        $.each(value, function (key1, value1) {

                            idClass = key.replace(".", "-");
                            idClass = idClass.replace(".", "-");

                            if (MMS.counterObj.count >= 1) {

                                editForm += '<label class="labelTag ' + idClass + '-' + MMS.counterObj.count + '">' + value1;
                                editForm += '&nbsp;<span class="remove"><a href="#" id="' + idClass + '-' + MMS.counterObj.count + '-remove" onclick="MMS.metadata.removeClonedField(event, this.id);" title="Remove ' + key + '"><span>Del</span></a></span>';

                                if (field.type === 'text' || field.type === 'textarea') {
                                    editForm += '<input id="' + idClass + '-' + MMS.counterObj.count + '" name="' + key + '[]" type="hidden" value="' + value1 + '" ' + required + ' />';
                                }

                                //if (field.type === 'textarea') {
                                //    editForm += "<textarea id='"+ idClass + "-" + MMS.counterObj.count + "' name='" + key + "[]' rows='7' cols='55' " + required + ">" + value1 + "</textarea> ";
                                //}

                                editForm += '</label>&nbsp;';

                            } else {

                                if (field.required === 'true') {
                                    var required = 'required';
                                }

                                editForm += '<fieldset class="' + idClass + '-' + MMS.counterObj.count + '">';
                                editForm += '<label>' + field.label + '&nbsp;<span class="clone"><a href="#" id="' + idClass + '-' + MMS.counterObj.count + '-clone" onclick="MMS.metadata.constructFieldEvent( event, this.id );" title="Add ' + key + '"><span>Add</span></a></span></label>';


                                if (field.type === 'select') {

                                    if (field.required === 'true') {
                                        var required = 'class="required"';
                                    }

                                    //editForm += '<select name="' + field.element + '[]" id="' + field.id + '" ' + required + '"></select>';
                                    editForm += '<input id="' + field.id + '-' + MMS.counterObj.count + '" name="' + field.element + '[]" type="text" value="' + value1 + '" ' + required + ' />';

                                }

                                if (field.type === 'text') {
                                    editForm += '<input id="' + idClass + '-' + MMS.counterObj.count + '" name="' + key + '[]" type="text" value="' + value1 + '" ' + required + ' />';
                                }

                                if (field.type === 'textarea') {
                                    editForm += '<textarea id="' + idClass + '-' + MMS.counterObj.count + '" name="' + key + '[]" rows="7" cols="55" ' + required + '>' + value1 + '</textarea>';
                                }

                                editForm += '</fieldset>';
                            }

                            MMS.counterObj.count++;

                        });
                    }
                }

                // optional fields in record
                if (field.required === 'false' && field.element === key) {
                    optionalFields.push(key);
                }
            });
        });

        $.each(response, function (key, value) {

            // hidden
            if (key === "collection") {

                editForm += "<input id='" + key + "-0' name='collection[]' type='hidden' value='" + value + "' />";

            } else if (key === "identifier.system") {

                editForm += "<input id='" + key + "' name='identifier.system[]' type='hidden' value='" + value + "' />";

            } else if (key === "pid") {

                editForm += "<input id='" + key + "' name='pid[]' type='hidden' value='" + value + "' />";

            } else if (key === "identifier.legacy") {

                editForm += "<input id='identifier-legacy' name='identifier.legacy[]' type='hidden' value='" + value + "' />";

            } else if (key === "identifier.master") {

                //editForm += "<input id='identifier-master' name='identifier.master[]' type='text' value='" + value + "' />";

            } else if (key === "objectType") {

                objectType = value;
                editForm += "<input name='" + key + "[]' type='hidden' value='" + value + "' />";

            } else if (key === "date.created") {

                editForm += "<fieldset>";
                editForm += "<label class='datecreated'>" + key + "</label>";
                editForm += "<input class='datecreated' type='text' value='" + value + "' disabled />";
                editForm += "<input class='datecreated' name='" + key + "[]' type='hidden' value='" + value + "'/>";
                editForm += "</fieldset>";

            } else if (key === "date.modified") {

                editForm += "<fieldset>";
                editForm += "<label class='datemodified'>" + key + "</label>";
                editForm += "<input class='datemodified' type='text' value='" + value + "' disabled />";
                editForm += "</fieldset>";

            }
        });

        // render optional fields that are not in the record
        $.each(sortedFields, function (i, field) {

            if (field.required === "false") {

                if (optionalFields.indexOf(field.element) > -1 ? true : false) {
                    // meow!
                } else {

                    editForm += "<fieldset class='" + field.id + "-0' style='display:none;'>";
                    editForm += "<label>" + field.label + "&nbsp;<span class='remove'><a href='#' id='" + field.id + "-0-remove' onclick='MMS.metadata.constructFieldEvent(event, this.id); return false;' title='Remove " + field.element + "'><span>Del</span></a></span></label>";

                    if (field.type === "text") {
                        editForm += "<input id='" + field.id + "-0' name='" + field.element + "[]' type='" + field.type + "' value='' />";
                    } else if (field.type === "textarea") {
                        editForm += "<textarea id='" + field.id + "-0' name='" + field.element + "[]' rows='7' cols='55'></textarea> ";
                    }
                    editForm += "</fieldset>";
                }
            }
        });

        viewObj.footer = '<div class="submit_link"><input id="metadata-save-button" type="submit" value="Save"></div>';
        MMS.view.createView(viewObj);
        var link = createBackLink(type);
        $("#pid").append(link);
        $(metadata).append(editForm);
        validate();
        $(".optional_fields").show();
        $("#optional_fields").show();
        $(metadataForms).show();
        createOptionalElementLinks();
        checkRequiredFields();
    };

    /**
     * generates required fields if missing from imported records
     */
    checkRequiredFields = function () {

        MMS.counterObj.count = 0;

        var sortedFields = sortObjects(mms_metadata_fields, 'displayOrder');

        $.each(sortedFields, function (i, field) {
            if ($('#' + field.id + '-0').length === 0 && field.type != 'select') {
                $f = constructField(field);
                $f.appendTo(metadata);
            }
        });
    }

    /**
     * binds events to core fields (clone/remove)
     * @param event
     * @param id
     */
    constructFieldEvent = function (event, id) {

        var action,
            idArray = id.split("-"),
            idCount = idArray[idArray.length - 2],
            i,
            newId,
            fieldElement,
            tempArr = [];

        if (idArray[idArray.length - 1] === "clone") {

            idArray.pop();
            idArray.pop();

            for (i = 0; i < idArray.length; i++) {
                tempArr.push(idArray[i]);
            }

            newId = tempArr.join("-");
            newId = newId.replace(".", "-");
            newId = newId.replace(".", "-");

            action = function () {

                $.each(mms_metadata_fields, function (i, field) {

                    fieldElement = field.element.replace(".", "-");
                    fieldElement = fieldElement.replace(".", "-");

                    if (newId === fieldElement) {
                        cloneFieldSet(event, field);
                    }
                });
            };

            repeatField(action);

        } else if (idArray[idArray.length - 1] === "remove") {

            idArray.pop();
            for (i = 0; i < idArray.length; i++) {
                tempArr.push(idArray[i]);
            }

            newId = tempArr.join("-");

            if (idCount === "0") {
                action = function () {
                    $("#" + newId).val("");
                    $("." + newId).hide()
                };
            } else {
                action = function () {
                    $("." + id).remove();
                };
            }

            removeField(action);
        }
    };

    /**
     * removes cloned field
     * @param event
     * @param id
     */
    removeClonedField = function (event, id) {

        event.preventDefault();
        event.stopPropagation();
        id = id.replace("-remove", "");
        $("." + id).remove();
    };

    /**
     * removes field - core fields
     * @param action
     */
    removeField = function (action) {
        action();
    };

    /**
     * clones field - core fields
     * @param action
     */
    repeatField = function (action) {
        action();
    };

    /**
     * clears disabled editor vocabulary fields
     * @param id
     */
    clearField = function (id) {
        id = id.replace("-clear", "");
        $('#' + id).val('');
    };

    /**
     * constructs form fields
     * @param filedObj
     * @return fObj
     */
    constructField = function (fieldObj) {

        var profileObj = JSON.parse(sessionStorage.getItem("mms_profile"));
        var field = "";
        var clearField = "";

        if (fieldObj.type === "select") {

            if (fieldObj.required === "true") {
                //var required = "class='required";
            }

            field += "<fieldset class='" + fieldObj.id + "-" + MMS.counterObj.count + "'>";
            field += "<label for='" + fieldObj.id + "'>" + fieldObj.label + "</label>";
            field += "<select name='" + fieldObj.element + "[]' id='" + fieldObj.id + "' " + required + "'></select>";
            field += "</fieldset>";

        } else {

            if (fieldObj.vocabulary === "true" && profileObj.roleID == "2") {
                clearField = "&nbsp;&nbsp;<a href='#' id='" + fieldObj.id + "-" + MMS.counterObj.count + "-clear' onclick='MMS.metadata.clearField(this.id);return false;'><img src='" + MMS.configObj.baseUrl + "images/glyphicons_197_remove.png' alt='Remove' /></a>";
            }

            field += "<fieldset class='" + fieldObj.id + "-" + MMS.counterObj.count + "'>";
            field += "<label>";
            field += fieldObj.label;

            if (fieldObj.repeat === "true") {
                field += "<span class='clone'><a href='#' id='" + fieldObj.id + "-" + MMS.counterObj.count + "-clone' onclick='MMS.metadata.constructFieldEvent(event, this.id);' title='Add " + fieldObj.element + "'><span>Add</span></a></span>";
            } else if (fieldObj.repeat === "false") {
                field += "<a href='#' id='" + fieldObj.id + "-" + MMS.counterObj.count + "-clone' onclick='MMS.metadata.constructFieldEvent(event, this.id);' ></a>"; //" + fieldObj.element + "'
            }

            if (fieldObj.required === "false") {
                field += "&nbsp;&nbsp;<span class='remove'><a href='#' id='" + fieldObj.id + "-" + MMS.counterObj.count + "-remove' onclick='MMS.metadata.constructFieldEvent(event, this.id);' title='Remove " + fieldObj.element + "'><span>Del</span></a></span>";
            }

            field += "</label>" + clearField;

            if (fieldObj.type === "text") {
                field += "<input ";
            } else if (fieldObj.type === "textarea") {
                field += "<textarea ";
            }

            field += "id='" + fieldObj.id + "-" + MMS.counterObj.count + "'";
            field += "name='" + fieldObj.element + "[]' ";
            field += "type='" + fieldObj.type + "' ";

            if (fieldObj.id === "identifier") { // tooltip
                field += "title='Use ISBN as file name for each .pdf and .kes file. Append a letter to the end of the ISBN number if there are more than two files. i.e. 1937785734.pdf, 1937785734.kes, 1937785734a.pdf, 1937785734b.pdf' ";
            }

            field += "class='";

            if (fieldObj.required === "true") {
                //field += "required";
            }

            field += "'";

            if (fieldObj.type === "text") {
                field += "/>";
            } else if (fieldObj.type === "textarea") {
                field += "rows='14' cols='45'></textarea>";
            }

            field += "</fieldset>";
        }

        if (fieldObj.required === "true") {
            $fObj = $(field);
        } else if (fieldObj.required === "false") {
            $fObj = $(field).hide();
        }

        return $fObj;
    };

    /**
     * generates optional field links
     * @param options
     */
    createOptionalElementLinks = function () {

        $("#optional_fields").empty();

        $.each(mms_metadata_fields, function (i, field) {

            if (field.required === "false" && field.hidden !== "true") {

                var menuField = "<li class='icn_categories'><a href='#'>" + field.label + "</a></li>";
                $optionalField = $(menuField).on("click", "a", function (event) {
                    event.preventDefault();
                    MMS.metadata.appendOptionalField(field);
                });

                $optionalField.appendTo("#optional_fields");
            }
        });
    };

    /**
     *
     * @param event
     * @param fieldObj
     * @returns {string}
     */
    appendOptionalField = function (field) {
        $("." + field.id + "-0").show();
        location.hash = "#" + field.id + "-0";
    };

    /**
     *
     * @param event
     * @param fieldObj
     * @returns {string}
     */
    cloneFieldSet = function (event, fieldObj) {

        event.preventDefault();
        event.stopPropagation();

        var value = $('#' + fieldObj.id + "-0").val();
        if (value.length === 0) {
            return;
        } else {
            $('#' + fieldObj.id + "-0").val("");
        }

        MMS.counterObj.count++;

        var clone = "";
        var clonedField = "";
        clonedField += "<label class='labelTag " + fieldObj.id + "-" + MMS.counterObj.count + "'>" + value;
        clonedField += "&nbsp;<span class='remove'><a href='#' id='" + fieldObj.id + "-" + MMS.counterObj.count + "-remove' onclick='MMS.metadata.removeClonedField(event, this.id);' title='Remove " + fieldObj.element + "'><span>Del</span></a></span>";

        //if (fieldObj.type === "text") {
        clonedField += "<input ";
        //} else if(fieldObj.type === "textarea") {
        //    clonedField += "<textarea ";
        //}

        clonedField += "id='" + fieldObj.id + "-" + MMS.counterObj.count + "'";
        clonedField += "name='" + fieldObj.element + "[]' ";
        clonedField += "type='hidden' ";
        clonedField += "value='" + value + "'";
        clonedField += "class='none ";
        clonedField += "'";

        //if (fieldObj.type === "text") {
        clonedField += "/>";
        //} else if (fieldObj.type === "textarea") {
        //    clonedField += "rows='10' cols='45'></textarea>";
        //}

        clonedField += "</label>&nbsp;&nbsp;";
        clone = $(clonedField).insertAfter("." + fieldObj.id + "-0");

        return clone;
    };

    /**
     * collects form data and sends to server
     */
    saveMetadata = function () {

        var profileObj = JSON.parse(sessionStorage.getItem("mms_profile"));
        var pid = $('.pid').val();
        var type = $('#type').val();

        requestObj = {
            type: "POST",
            url: MMS.configObj.repository + '?t=' + profileObj.token + '&uid=' + profileObj.userID,
            data: $(metadataForm).serialize(),
            dataType: "json",
            cache: false,
            success: function (response) {

                if (response.updated === true) {

                    requestObj = {
                        type: "GET",
                        url: MMS.configObj.repository,
                        data: "pid=" + response.pid,
                        dataType: "json",
                        cache: true,
                        success: function (response, type) {

                            location.hash = "#header";

                            if (type === 'success') {
                                $("#message").html("<h4 class='alert_success'>Record Updated.</h4>");
                            }

                            setTimeout(function () {
                                $("#message").empty();
                            }, 5000);

                            createMetadataEditForm(response, response.pid.toString(), type);
                        }
                    };

                     MMS.utils.doAjax(requestObj);

                } else if (response.created === true) {

                    $('#metadata-forms').fadeOut();

                    $("div#actionFeedback").empty().append("<h4 class='alert_success'>Record Saved.</h4>");
                    setTimeout(function () {
                        $("div#actionFeedback").empty();
                    }, 10000);

                    location.hash = "#header";
                }
            }
        };

        MMS.utils.doAjax(requestObj);
    };

    /**
     * retrieves record from repository and generates edit form
     * @param event
     * @param pid
     */
    getMetadata = function (event, pid, type) {

        var profileObj = JSON.parse(sessionStorage.getItem("mms_profile"));
        event.preventDefault();

        requestObj = {
            type: "GET",
            url: MMS.configObj.repository,
            data: "pid=" + pid + '&t=' + profileObj.token,
            dataType: "json",
            cache: false,
            success: function (response) {
                createMetadataEditForm(response, pid, type);
            }
        };

        MMS.utils.doAjax(requestObj);
    };

    /**
     * "Clones" record...
     * * The pid is removed from the rendered FORM.  When the user submits the record, the absence of a pid causes
     * the mms system to assign a new pid and therefore create a new record.
     */
    cloneRecord = function () {

        var pid = $('.pid').val();
        $('.pid').remove();
        $('#isPid').remove();
        //$('#edit-mode').remove();
        $('#clone').remove();
        $('.datecreated').remove();
        $('.datemodified').remove();
        $('#identifier-0').val("");
        $('.identifier-master-0').remove();
        /*
         $("#creator-alternative-0").remove();
         $("#description-creatorbio-0").remove();
         $("#description-nationality-0").remove();
         $("#description-role-0").remove();
         $("#description-lifedates-0").remove();
         $("#description-source-0").remove();
         */
        $("div#actionFeedback").empty().append("<h4 class='alert_info'>Your are now working with a copy of record " + pid + ".</h4>");
    };

    /**
     * validates core form fields
     */
    validate = function () {
        $(metadataForm).validate({
            errorClass: "invalid",
            rules: {
                'title[]': {
                    required: true
                },
                'identifier[]': {
                    required: true
                },
                'isbn[]': {
                    required: true,
                    minlength: 13,
                    maxlength: 13
                }
            },
            messages: {
                'title[]': {
                    required: "Please enter a Title"
                },
                'identifier[]': {
                    required: "Please enter a File Name"
                },
                'isbn[]': {
                    required: "Please enter an ISBN",
                    minlength: "Please enter 13 digits"
                }
            },
            submitHandler: function () {
                saveMetadata();
            }
        });
    };

    /**
     * deletes record
     * @param pid
     */
    deleteMetadata = function (event, pid) {

        event.preventDefault();

        var remove = confirm("Are you sure you want to delete this record?");

        if (remove) {

            requestObj = {
                type: "POST",
                url: MMS.configObj.repository,
                data: "pid=" + pid,
                dataType: "json",
                cache: true,
                success: function (response) {
                    if (response.deleted === 'true') {
                        $("#search-forms").hide();
                        $("div#actionFeedback").empty().append("<h4 class='alert_success'>Record Deleted.</h4>");
                        setTimeout(function () {
                            $("div#actionFeedback").empty();
                        }, 5000);
                        location.hash = "#header";
                    } else {
                        alert('Error: Record not deleted.');
                    }
                }
            };

            MMS.utils.doAjax(requestObj);
        }
        return false;
    };

    /** http://stackoverflow.com/questions/8175093/simple-function-to-sort-a-json-object-using-javascript
     * sorts array of json objects by display order
     * @param array
     * @param key
     * @returns {*}
     */
    sortObjects = function (mms_metadata_fields, key) {

        var array = [];
        for (var i in mms_metadata_fields) {
            array.push(mms_metadata_fields[i]);
        }
        return array.sort(function (a, b) {
            var x = a[key];
            var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    };

    /**
     * loads form based on object type
     */
    loadForm = function () {

        MMS.counterObj.count = 0;
        $('#search-results').empty();
        MMS.view.createView(viewObj);
        mms_metadata_fields = JSON.parse(sessionStorage.getItem("mms_dsp_metadata_fields"));
        createMetadataForm();
        createOptionalElementLinks();
        validate();
        $(".current").html("metadata");
        $("#clone-record").remove();
        $(metadataForms).show();
        $(".optional_fields").show();
        $("#optional_fields").show();
    };

    /**
     * Hides form and binds load form event when dashboard is loaded
     */
    init = function () {

        $(metadataForms).hide();
        $(".optional_fields").hide();

        $(".formType").on("click", function (event) {
            loadForm($(this).attr("id"));
        });

        $(document).tooltip();
    };

    return {
        getMetadata: function (event, pid, type) {
            getMetadata(event, pid, type);
        },
        deleteMetadata: function (event, pid) {
            deleteMetadata(event, pid);
        },
        removeClonedField: function (event, id) {
            removeClonedField(event, id);
        },
        constructFieldEvent: function (event, id) {
            constructFieldEvent(event, id);
        },
        cloneRecord: function (pid) {
            cloneRecord(pid);
        },
        back: function (type) {
            back(type);
        },
        createMetadataEditForm: function (response, pid, type) {
            createMetadataEditForm(response, pid, type);
        },
        appendOptionalField: function (field) {
            appendOptionalField(field);
        },
        clearField: function (id) {
            clearField(id);
        },
        loadForm: function (id) {
            loadForm(id);
        },
        init: function () {
            init();
        }
    };

}(jQuery));