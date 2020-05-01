MMS.namespace("MMS.controlledVocabularies");

MMS.controlledVocabularies = (function($) {

    "use strict";

    // ** dependencies **/
    // MMS.configObj
    // MMS.utils

    var getVocabularyTerms,
        id,
        init,
        displayVocabularyTerms,
        displayControlledVocabulariesBox,
        selectVocabularyTerm,
        setVocabularyTerm,
        requestObj,
        getRole,
        getTermData,
        displayTermData,
        controlledVocabularyView,
        createControlledVocabularyForm,
        getLists,
        resetLists,
        displayList,
        appendVocabValues,
        saveLocalCreator,
        saveLocalSubject,
        createLocalSubjectsForm,
        validate,
        loadCreatorForm,
        loadSubjectForm,
        viewObj;

    viewObj = {
        content: 'content',
        articleID: 'controlled-vocabulary-forms',
        articleClass: 'module width_3_quarter',
        h3ID: 'null',
        h3Value: '',
        formID: 'controlled-vocabulary-form',
        divID: 'controlledvocabulary',
        divClass: 'module_content',
        header: 'null',
        footer: '<div class="submit_link"><input id="controlledvocabulary-save-button" type="submit" value="Save"></div>'
    };

    controlledVocabularyView = function() {

        var view = '';
        view += '<article id="controlled-vocabulary-section" class="module width_quarter">';
        view += '<header><h3>Controlled Vocabularies</h3></header>';
        view += '<div id="vocab_search_box" name="vocab_search_box" class="quick_search" >';
        view += '<input name="term" id="vocabTerm" type="text" placeholder="Search" />&nbsp;';
        view += '<p>';
        view += '<select id="vocab-options" name="vocab-options">';
        view += '<option value="ulan" selected>ULAN</option>';
        view += '<option value="aat">AAT</option>';
        view += '<option value="locnames">LC-Names</option>';
        view += '<option value="locsubjects">LC-Subjects</option>';
        view += '<option value="aloracreators">Alora-Creators</option>';
        view += '<option value="alorasubjects">Alora-Subjects</option>';
        view += '</select>&nbsp;';
        view += '<input id="getVocabularies" type="submit" value="Go" />';
        view += '</p>';
        view += '</div>';
        view += '<div id="vocabulary-results"></div>';
        view += '</article>';

        return view;
    };

    /**
     * loads creator form
     */
    loadCreatorForm = function() {

        $('#search-results').empty();
        MMS.view.createView(viewObj);
        createControlledVocabularyForm();
        validate();
        $(".current").html("Creator");
        $("#controlled-vocabulary-form").show();

    };

    /**
     * loads subject form
     */
    loadSubjectForm = function() {

        $('#search-results').empty();
        MMS.view.createView(viewObj);
        createLocalSubjectsForm();
        validate();
        $(".current").html("Subject");
        $("#controlled-vocabulary-form").show();

    };

    /**
     * validates core form fields
     */
    validate = function() {
        $("#controlled-vocabulary-form").validate({
            errorClass: "invalid",
            submitHandler: function() {
                saveLocalCreator();
            }
        });
    };

    /**
     * saves local creator vocab
     */
    saveLocalCreator = function() {

        requestObj = {
            type: "POST",
            url: MMS.configObj.creatorapi,
            data:  $("#controlled-vocabulary-form").serialize(),
            dataType: "text",
            cache: false,
            success: function (response) {

                if (response === "success") {
                    $("div#actionFeedback").empty().append("<h4 class='alert_success'>Record Saved.</h4>");
                    $("#controlled-vocabulary-form").find('input[type=text], textarea').val('');
                    setTimeout(function() {
                        $("div#actionFeedback").empty();
                    }, 5000);
                    location.hash = "#header";
                    return false;
                } else {
                    alert("Record Not Saved.");
                }
            }
        };

        MMS.utils.doAjax(requestObj);
    };

    /**
     * saves local subject vocab
     */
    saveLocalSubject = function() {

        requestObj = {
            type: "POST",
            url: MMS.configObj.subjectapi,
            data:  $("#controlled-vocabulary-form").serialize(),
            dataType: "text",
            cache: false,
            success: function (response) {

                if (response === "success") {
                    $("div#actionFeedback").empty().append("<h4 class='alert_success'>Record Saved.</h4>");
                    $("#controlled-vocabulary-form").find('input[type=text], textarea').val('');
                    setTimeout(function() {
                        $("div#actionFeedback").empty();
                    }, 5000);
                    location.hash = "#header";
                    return false;
                } else {
                    alert("Record Not Saved.");
                }
            }
        };

        MMS.utils.doAjax(requestObj);
    };

    /**
     *  creates local subjects entry form
     */
    createLocalSubjectsForm = function() {

        var view = '';
        view += "<fieldset>";
        view += "<label>";
        view += "* Subject";
        view += "</label>";
        view += "<input id='subject' name='subject[]' type='text' class='required' />";
        view += "</fieldset>";
        view += "<label>";

        $("#controlledvocabulary").append(view);
    };

    /**
     * creates local vocabulary entry form
     */
    createControlledVocabularyForm = function() {

        var view = '';
        view += "<fieldset>";
        view += "<label>";
        view += "* Creator";
        view += "</label>";
        view += "<input id='creator' name='creator[]' type='text' class='required' />";
        view += "</fieldset>";
        view += "<fieldset>";
        view += "<label>";
        view += "* Creator Alternative";
        view += "</label>";
        view += "<input id='creator-alternative' name='creator.alternative[]' type='text' class='required' />";
        view += "</fieldset>";
        view += "<fieldset>";
        view += "<label>";
        view += "* Nationality";
        view += "</label>";
        view += "<input id='description-nationality' name='description.nationality[]' type='text' class='required' />";
        view += "</fieldset>";
        view += "<fieldset>";
        view += "<label>";
        view += "* Role";
        view += "</label>";
        view += "<input id='description-role' name='description.role[]' type='text' class='required' />";
        view += "</fieldset>";
        view += "<fieldset>";
        view += "<label>";
        view += "* Biography";
        view += "</label>";
        view += "<input id='description-creatorbio' name='description.creatorbio[]' type='text' class='required' />";
        view += "</fieldset>";
        view += "<fieldset>";
        view += "<label>";
        view += "* Sex";
        view += "</label>";
        view += "<select name='sex'><option value='Male'>Male</option><option value='Female'>Female</option></select>";
        view += "</fieldset>";
        view += "<fieldset>";
        view += "<label>";
        view += "* Source";
        view += "</label>";
        view += "<input id='source' name='source' type='text' class='required' />";
        view += "</fieldset>";
        view += "<fieldset>";
        view += "<label>";
        view += "* Earliest Date";
        view += "</label>";
        view += "<input id='earliestdates' name='earliestdates' type='text' class='required' />";
        view += "</fieldset>";
        view += "<fieldset>";
        view += "<label>";
        view += "* Latest Date";
        view += "</label>";
        view += "<input id='latestdates' name='latestdates' type='text' class='required' />";
        view += "</fieldset>";

        $("#controlledvocabulary").append(view);
    };

    /**
     * retrieves role ID
     * @return {*}
     */
    getRole = function() {
        return sessionStorage.getItem("roleID");
    };

    /**
     * retrieves search values and makes api request
     */
    getVocabularyTerms = function() {

        var option,
        term = $("input#vocabTerm").val(),
        checked = $("select#vocab-options");
        term = MMS.utils.sanitizeInput(term);

        if (checked.length > 0) {
            option = checked.val();
        }

        requestObj = {
            type: "POST",
            url: MMS.configObj.vocabUrl,
            data: "term=" + term + "&option=" + option,
            dataType: "json",
            cache: true,
            success: function (response) {
                displayVocabularyTerms(option, response);
            }
        };

        MMS.utils.doAjax(requestObj);
    };

    /**
     * retrieves vocabulary based on id
     * @param id
     * @param vocabType
     * @param callback
     */
    getTermData = function(id, vocabType, callback) {

        var data = "id=" + id + "&vocabType=" + vocabType;

        if (callback === undefined) {
            var callback = function (response) {
                displayTermData(id, response);
            };
        }

        requestObj = {
            type: "GET",
            url: MMS.configObj.vocabUrl,
            data: data,
            dataType: "json",
            cache: true,
            success: callback
        };

        MMS.utils.doAjax(requestObj);
    };

    /**
     * Displays
     * @param id
     * @param response
     */
    displayTermData = function(id, response) {

        var results = '',
        val = $('span#' + id + '-toggle').text();

        if (val === '( + )' ) {
            $('span#' + id + '-toggle').text('( - )');
            $('div#' + id + '-vocab-data').show();
        } else if (val === '( - )') {
            $('div#' + id + '-vocab-data').hide();
            $('span#' + id + '-toggle').text('( + )');
        }

        $.each(response, function(key, value) {

            if (value.subject_id !== undefined) {
                results += '<p><strong>Subject id:</strong> ' + value.subject_id + '</p>';
            }

            if (value.nationalities !== '') {
                results += '<p><strong>Nationality:</strong> ' + value.nationalities + '</p>';
            }

            if (value.role_id !== '') {
                results += '<p><strong>Role:</strong> ' + value.role_id + '</p>';
            }

            if (value.preferred_terms_source_id !== '') {
                results += '<p><strong>Source:</strong> ' + value.preferred_terms_source_id + '</p>';
            }

            if (value.non_preferred_terms_term_text !== '') {
                results += '<p><strong>Alternative name:</strong> ' + value.non_preferred_terms_term_text + '</p>';
            }

            if (value.preferred_biographies_biography_text !== '') {
                results += '<p><strong>Bio:</strong> ' + value.preferred_biographies_biography_text + '</p>';
            }

            if (value.preferred_biographies_birth_date !== '') {
                results += '<p><strong>Birth date:</strong> ' + value.preferred_biographies_birth_date + '</p>';
            }

            if (value.preferred_biographies_death_date !== '') {
                results += '<p><strong>Death date:</strong> ' + value.preferred_biographies_death_date + '</p>';
            }

            if (value.preferred_biographies_sex !== '') {
                results += '<p><strong>Sex:</strong> ' + value.preferred_biographies_sex + '</p>';
            }
        });

        $('div#' + id + '-vocab-data').empty().append(results);
    };

    /**
     * Sets the selected vocabulary term in designated field
     * @param term
     * @param count
     * @param fieldName
     * @returns field
     */
    setVocabularyTerm = function(term, count, fieldName) {

        var field;

        while (count < 50) {  // 50 is an arbritrary number...
            field = $('#' + fieldName + '-' + count).val();
            if (field === '') {
                $('#' + fieldName + '-' + count).val(term);
                break;
            }
            count++;
        }

        return field;
    };

    /**
     * selects vocabulary term and places it in the current form field
     * @param id
     * @param term
     */
    selectVocabularyTerm = function(id, term) {

        var creator,
        repository,
        subject,
        stylePeriod,
        option,
        count = 1,
        callback = function(response) {
            appendVocabValues(response);
        },

        checked = $("select#vocab-options");

        if (getRole() == "2") {
            $("#" + id).removeAttr("disabled");
            $("#" + id).attr("readonly", "readonly");
        }

        if (checked.length > 0) {
            option = checked.val();
        }

        if (option === 'ulan' || option === 'locnames' || option === 'aloracreators') {

            if (option !== 'locnames') {
                getTermData(id, option, callback);
            }

            creator = $('#creator-0').val();

            if (creator === '') {
                setVocabularyTerm(term, 0, 'creator');
            } else {

                repository = $('#coverage-spatial-repository-0').val(term);

                if (repository === '') {
                    setVocabularyTerm(term, 0, 'coverage-spatial-repository');
                } else {
                    setVocabularyTerm(term, count, 'coverage-spatial-repository');
                }
            }

        } else if (option === 'aat' || option === 'locsubjects' || option === 'alorasubjects') {

            stylePeriod = $('#coverage-temporal-styleperiod-0').val();

            if (stylePeriod === '') {
                setVocabularyTerm(term, 0, 'coverage-temporal-styleperiod');
            } else {
                stylePeriod = setVocabularyTerm(term, count, 'coverage-temporal-styleperiod');
            }

            if (stylePeriod === undefined) {

                subject = $('#subject-0').val();

                if (subject === '') {
                    setVocabularyTerm(term, 0, 'subject');
                } else {
                    setVocabularyTerm(term, count, 'subject');
                }
            }
        }
    };

    /**
     * adds additional creator vocabulary fields when a term is selected from the vocab list
     * @param response
     */
    appendVocabValues = function(response) {

        var results = '';
        $.each(response, function(key, value) {
            // TODO: check each value. don't append empty values
            results += '<input name="creator.alternative[]" type="hidden" value="' + value.non_preferred_terms_term_text + '" />';
            results += '<input name="description.creatorbio[]" type="hidden" value="' + value.preferred_biographies_biography_text + '" />';
            results += '<input name="description.nationality[]" type="hidden" value="' + value.nationalities + '" />';
            results += '<input name="description.role[]" type="hidden" value="' + value.role_id + '" />';
            results += '<input name="description.lifedates[]" type="hidden" value="' + value.preferred_biographies_birth_date + '-' + value.preferred_biographies_death_date + '" />';
            results += '<input name="source[]" type="hidden" value="' + value.preferred_terms_source_id + '" />';
        });

        $('div#metadata').append(results);
    };

    /**
     * displays vocabulary terms
     * @param id
     * @param type
     * @param response
     */
    displayVocabularyTerms = function(option, response) {

        var recordset,
        results = '';

        if (option === 'ulan') {

            recordset = response.getty.response.docs;

            $.each(recordset, function(key, value){
                results += "<p><ul><li><a href='#' id='" + id + "' onclick='MMS.controlledVocabularies.selectVocabularyTerm(" + value.id + ", $(this).text());return false;'>" + value.preferred_terms_term_text_t + "</a>&nbsp;&nbsp;<a href='#' onclick='MMS.controlledVocabularies.getTermData(" + value.id + ", \"ulan\");return false;'><span id='" + value.id + "-toggle'>( + )</span></a><div id='" + value.id + "-vocab-data' class='vocab-data'></div></li></ul></p>";
            });

        } else if (option === 'aat') {

            recordset = response.getty.response.docs;

            $.each(recordset, function(key, value){
                results += "<p><ul><li><a href='#' id='" + id + "' onclick='MMS.controlledVocabularies.selectVocabularyTerm(" + value.id + ", $(this).text());return false;'>" + value.preferred_terms_term_text_t + "</a><div id='" + value.id + "-vocab-data' class='vocab-data'></div></li></ul></p>";
            });

        } else if (option === 'locnames' || option === 'locsubjects') {

            recordset = response.loc;

            $.each(recordset, function(key, value){
                results += "<p><ul><li><a href='#' id='" + id + "' onclick='MMS.controlledVocabularies.selectVocabularyTerm(" + id + ", $(this).text());return false;'>" + response.loc[key].title + "</a><br /><a href='#'>" + value.id + "</a></li></ul></p>";
            });

        } else if (option === 'aloracreators' || option === 'alorasubjects') {

            recordset = response.local;

            if (recordset.message !== undefined) {
                results += "<p><ul><li>No results found.</li></ul></p>";
                // TODO: not working ...
                $("div#vocabulary-results").empty().append(results);
                return;
            }

            $.each(recordset, function(key, value){
                if (option === 'aloracreators') {
                    results += "<p><ul><li><a href='#' id='" + id + "' onclick='MMS.controlledVocabularies.selectVocabularyTerm(" + value.id + ", $(this).text());return false;'>" + value.preferred_terms_term_text + "</a>&nbsp;&nbsp;<a href='#' onclick='MMS.controlledVocabularies.getTermData(" +  value.id + ", \"local\");return false;'><span id='" + value.id + "-toggle'>( + )</span></a><div id='" + value.id + "-vocab-data' class='vocab-data'></div></li></ul></p>";
                } else {
                    results += "<p><ul><li><a href='#' id='" + id + "' onclick='MMS.controlledVocabularies.selectVocabularyTerm(" + value.id + ", $(this).text());return false;'>" + value.preferred_terms_term_text + "</a></li></ul></p>";

                }
            });
        }

        $("div#vocabulary-results").empty().append(results);
    };

    /**
     * displays controlled vocabulary search box
     */
    displayControlledVocabulariesBox = function() {

        $("#controlled-vocabulary-section").show();

        var view = controlledVocabularyView();
        $("#content").append(view);

        $("input#vocabTerm").keyup(function(event){
            if(event.keyCode == 13){
                $("input#getVocabularies").click();
            }
        });

        $("select#vocab-options").keyup(function(event){
            if(event.keyCode == 13){
                $("input#getVocabularies").click();
            }
        });

        $("input#getVocabularies").on("click", function() {
            getVocabularyTerms();
        });
    };

    /**
     *
     */
    resetLists = function() {
        $("select#type-arttypes").val("");
        $("select#type-timeperiods").val("");
        $("select#type-instructors").val("");
    };

    /**
     * retrieves form lists
     */
    getLists = function(callback) {

        var lists = ['arttypes', 'timeperiods', 'instructors'],
        requestObj = {},
        //display,
        i;

        if (callback === undefined) {
            callback = function (response) {
                displayList(response);
            }
        }

        for (i=0;i<lists.length;i++) {

            requestObj.type = "GET";
            requestObj.url = MMS.configObj.vocabUrl;
            requestObj.data = 'vocabType=' + lists[i];
            requestObj.dataType = 'json';
            requestObj.cache = true;
            requestObj.success = callback;

            MMS.utils.doAjax(requestObj);
        }
    };

    /**
     * displays lists
     * @param response
     */
    displayList = function(response) {

        var response = $.parseJSON(response);
        var list;
        var vocabType;
        var arttype = sessionStorage.getItem('arttypes');
        var timeperiod = sessionStorage.getItem('timeperiods');
        var instructor = sessionStorage.getItem('instructors');

        list = "<option value=''>---Select an term---</option>";
        $.each(response, function(key, value) {

            if (value.type) {
                vocabType = value.type;
            }

            if (value.term === arttype || value.term === timeperiod || value.term === instructor) {
                list += "<option value='" + value.term + "' selected>" + value.term + "</option>";
            } else {
                list += "<option value='" + value.term + "'>" + value.term + "</option>";
            }

        });

        $("select#type-" + vocabType).html(list);
        //sessionStorage.removeItem('arttypes');
        //sessionStorage.removeItem('timeperiods');
        //sessionStorage.removeItem('instructors');
    };

    init = function() {
        $("#controlled-vocabulary-section").hide();
    };

    return {
        getVocabularyTerms: function() {
            getVocabularyTerms();
        },
        displayControlledVocabulariesBox: function(event, id) {
            displayControlledVocabulariesBox(event, id);
        },
        selectVocabularyTerm: function(id, term) {
            selectVocabularyTerm(id, term);
        },
        getTermData: function(id, vocabType) {
            getTermData(id, vocabType);
        },
        getLists: function() {
            getLists();
        },
        resetLists: function() {
            resetLists();
        },
        loadCreatorForm: function() {
            loadCreatorForm();
        },
        loadSubjectForm: function() {
            loadSubjectForm();
        },
        init: function() {
            init();
        }
    };

}(jQuery));