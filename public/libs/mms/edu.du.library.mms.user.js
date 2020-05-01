MMS.namespace("MMS.user");

MMS.user = (function($) {

    // ** dependencies ** //
    // MMS.utils
    // MMS.ui
    // MMS.configObj
    // http://ajax.aspnetcdn.com/ajax/jquery.validate/1.9/jquery.validate.min.js

    "use strict";

    var user = "#user",
        userForm = "#user-form",
        userForms = "#user-forms",
        getSessionInfo,
        constructUserAddForm,
        constructUserEditForm,
        listUsers,
        validateUserForm,
        loadForm,
        init,
        saveUserData,
        deleteUserData,
        requestObj,
        saveRequestObj,
        deleteRequestObj,
        requestRoleObj,
        requestCollectionObj,
        requestProfileObj,
        profileRequestObj,
        viewObj;

    viewObj = {
        content: 'content',
        articleID: 'user-forms',
        articleClass: 'module width_3_quarter',
        h3ID: 'null',
        h3Value: '',
        formID: 'user-form',
        divID: 'user',
        divClass: 'module_content',
        header: 'null',
        footer: 'null'
    };

    /**
     * validates user forms
     */
    validateUserForm = function() {

        $(userForm).validate({
            errorClass: "invalid",
            rules: {
                firstName: {
                    required: true
                },
                lastName: {
                    required: true
                },
                duID: {
                    required: true,
                    digits: true,
                    minlength: 9
                }
            },
            messages: {
                firstName: {
                    required: "Please enter a First Name"
                },
                lastName: {
                    required: "Please enter a Last Name"
                },
                duID: {
                    required: "Please enter your DU ID",
                    digits: "Please enter only digits",
                    minlength: "Please enter at least 9 digits"
                }
            },
            submitHandler: function() {
                saveUserData();
            }
        });
    };

    /**
     * constructs Add User form fields
     */
    constructUserAddForm = function() {

        viewObj.footer = '<div class="submit_link"><input type="submit" value="Save"></div>';
        MMS.view.createView(viewObj);

        var fields = "";
        var firstName = "";
        var lastName = "";
        var duID = "";
        var cairUserName = "";
        var roles = "";
        var collections = "";

        firstName += "<fieldset>";
        firstName += "<label>";
        firstName += "* First Name";
        firstName += "</label>";
        firstName += "<input id='firstName' name='firstName' type='text' />"; //  class='required'
        firstName += "</fieldset>";

        lastName += "<fieldset>";
        lastName += "<label>";
        lastName += "* Last Name";
        lastName += "</label>";
        lastName += "<input id='lastName' name='lastName' type='text' />"; // class='required'
        lastName += "</fieldset>";

        duID += "<fieldset>";
        duID += "<label>";
        duID += "* DU ID";
        duID += "</label>";
        duID += "<input id='duID' name='duID' type='text' />"; // class='required'
        duID += "</fieldset>";

        /*
        requestRoleObj = {
            type: "GET",
            url: MMS.configObj.roles,
            dataType: "json",
            cache: true,
            async: false,
            success: function (response) {

                roles += "<fieldset>";
                roles += "<label for='roleID'>* Roles</label>";
                roles += "<select name='roleID' id='roleID' class='required'>";
                roles += "<option value=''>---Assign a role--</option>";
                $.each(response, function(key, value) {
                    if (key != '3') {
                        roles += "<option value='" + key + "'>" + value + "</option>";
                    }
                });
                roles += "</select>";
                roles += "</fieldset>";

                $(user).append(roles);

            }
        };
        */

        var profileObj = JSON.parse(sessionStorage.getItem("mms_profile"));

        /*
        if (profileObj.roleID == '3') {

            requestCollectionObj = {
                type: "GET",
                url: MMS.configObj.collections,
                dataType: "json",
                cache: true,
                async: false,
                success: function (response) {

                    collections += "<strong>* Assign a Collection</strong>";

                    $.each(response, function(key, value) {
                        collections += "<p><input id='" + value.collectionID + "' name='collections[]' type='radio' value='" + value.collectionID + "' /><label for='" + value.collectionID + "'>" + value.title + "</label></p>";
                    });

                    $(user).append(collections);
                }
            };

            MMS.utils.doAjax(requestCollectionObj);

        } else {
            */
            collections += "<input id='" + profileObj.collectionID + "' name='collections[]' type='hidden' value='" + profileObj.collectionID + "' />";
            fields += collections;
        //}

        //MMS.utils.doAjax(requestRoleObj);

        fields += "<input id='roleID' name='roleID[]' type='hidden' value='1' />";
        fields += firstName;
        fields += lastName;
        fields += duID;

        $(user).append(fields);

        validateUserForm();
    };

    /**
     * constructs Edit User form fields
     */
    listUsers = function() {

        viewObj.footer = 'null';
        MMS.view.createView(viewObj);

        // get users
        requestObj = {
            type: "GET",
            url: MMS.configObj.users,
            dataType: "json",
            cache: true,
            success: function (response) {

                // TODO: split out into display function
                var userResponse = "";
                userResponse += "<div class='tab_container'>";
                userResponse += "<div id='tab1' class='tab_content'>";
                userResponse += "<table class='tablesorter' cellspacing='0'>";
                userResponse += "<thead>";
                userResponse += "<tr>";
                userResponse += "<th>First Name</th>";
                userResponse += "<th>Last Name</th>";
                //userResponse += "<th>Role</th>";
                userResponse += "<th>Active</th>";
                userResponse += "<th>Actions</th>";
                userResponse += "</tr>";
                userResponse += "</thead>";
                userResponse += "<tbody>";

                $.each(response, function(key, value) {

                    userResponse += "<tr>";
                    userResponse += "<td>" + value.firstName + "</td>";
                    userResponse += "<td>" + value.lastName + "</td>";
                    //userResponse += "<td>" + value.roleName + "</td>";

                    if (value.isActive === "1") {
                        userResponse += "<td>Yes</td>";
                    } else {
                        userResponse += "<td>No</td>";
                    }

                    userResponse += "<td><input type='image' src='../../images/icn_edit.png' title='Edit' onclick='MMS.user.constructUserEditForm(" + value.id + "); return false;'></td>";
                    //delete <!--<input type='image' src='../../images/icn_trash.png' title='Trash' onclick='MMS.user.deleteUserData(" + value.id + "); return false;'>-->
                    userResponse += "</tr>";
                });

                userResponse += "</tbody>";
                userResponse += "</table>";
                userResponse += "</div>";
                userResponse += "</div>";

                $(user).append(userResponse);
            }
        };

        MMS.utils.doAjax(requestObj);
    };

    /**
     * creates edit form
     * @param userID
     */
    constructUserEditForm = function(userID) {

        var profile = "";
        var roles = "";
        var collections = "";
        var isActive = "";

        viewObj.footer = '<div class="submit_link"><input type="submit" value="Save"></div>';
        MMS.view.createView(viewObj);

        $(".current").html("Edit User");

        requestProfileObj = {

            type: "GET",
            url: MMS.configObj.users,
            data: "id=" + userID,
            dataType: "json",
            cache: false,
            async: false,
            success: function (response) {

                profile += "<input name='userID' type='hidden' value='" + userID + "' />";
                profile += "<fieldset>";
                profile += "<label>";
                profile += "* First Name";
                profile += "</label>";
                profile += "<input id='firstName' name='firstName' type='text' value='" + response[0].firstName + "' class='required' />";
                profile += "</fieldset>";

                profile += "<fieldset>";
                profile += "<label>";
                profile += "* Last Name";
                profile += "</label>";
                profile += "<input id='lastName' name='lastName' type='text' value='" + response[0].lastName + "' class='required' />";
                profile += "</fieldset>";

                $(user).append(profile);

                // get roles
                /*
                requestRoleObj = {
                    type: "GET",
                    url: MMS.configObj.roles,
                    dataType: "json",
                    cache: false,
                    async: false,
                    success: function (roleResponse) {

                        roles += "<fieldset>";
                        roles += "<label for='roleID'>* Roles</label>";
                        roles += "<select name='roleID' id='roleID' class='required'>";
                        roles += "<option value=''>---Assign a role--</option>";
                        $.each(roleResponse, function(key, value) {
                            if (response[0].roleID === key) {
                                roles += "<option value='" + key + "' selected>" + value + "</option>";
                            } else if (key != '3') {
                                roles += "<option value='" + key + "'>" + value + "</option>";
                            }
                        });
                        roles += "</select>";
                        roles += "</fieldset>";

                        $(user).append(roles);

                    }
                };
                */

                roles = "<input id='roleID' name='roleID[]' type='hidden' value='1' />";
                $(user).append(roles);
                var profileObj = JSON.parse(sessionStorage.getItem("mms_profile"));

                /*
                if (profileObj.roleID == '3') {

                    // get collections
                    requestCollectionObj = {
                        type: "GET",
                        url: MMS.configObj.collections,
                        dataType: "json",
                        cache: false,
                        async: false,
                        success: function (collectionResponse) {

                            collections += "<strong>* Assigned Collection</strong>";

                            $.each(collectionResponse, function(key, value) {

                                if (response[1].collectionID === value.collectionID) {
                                    collections += "<p><input id='" + value.collectionID + "' name='collectionID' type='radio' value='" + value.collectionID + "' checked /><label for='" + value.collectionID + "'>" + value.title + "</label></p>";
                                } else {
                                    collections += "<p><input id='" + value.collectionID + "' name='collectionID' type='radio' value='" + value.collectionID + "' /><label for='" + value.collectionID + "'>" + value.title + "</label></p>";
                                }
                            });
                        }
                    };

                    MMS.utils.doAjax(requestCollectionObj);

                } else {
                */
                    collections += "<input name='collectionID' type='hidden' value='" + profileObj.collectionID + "' />";
                //}

                $(user).append(collections);
                //MMS.utils.doAjax(requestRoleObj);

                isActive += "<fieldset>";
                isActive += "<label>* User status</label>";
                isActive += "<select name='isActive' id='isActive' class='required'>";

                if (response[0].isActive === '1') {
                    isActive += "<option value='" + response[0].isActive + "' selected>Active</option>";
                    isActive += "<option value='0'>Inactive</option>";
                } else if (response[0].isActive === '0') {
                    isActive += "<option value='" + response[0].isActive + "' selected>Inactive</option>";
                    isActive += "<option value='1'>Active</option>";
                }

                isActive += "</select>";
                isActive += "</fieldset>";

                $(user).append(isActive);

            }

        };

        MMS.utils.doAjax(requestProfileObj);
        validateUserForm();
    };

    /**
     * saves user profile data
     */
    saveUserData = function() {

        saveRequestObj = {
            type: "PUT",
            url: MMS.configObj.users,
            data: $(userForm).serialize(),
            dataType: "json",
            cache: false,
            success: function (response) {

                if (response.updated === "true") {
                    listUsers();
                } else if (response.updated === "false") {
                    alert("Error: Update failed.");
                } else {
                    $('#user-form')[0].reset();
                }
            }
        };

        MMS.utils.doAjax(saveRequestObj);
    };

    /**
     * delete user profile data
     * @param userID
     */
    deleteUserData = function(userID) {

        var remove = confirm("Are you sure you want to delete this user?");

        if (remove) {

            deleteRequestObj = {
                type: "POST",
                url: MMS.configObj.users,
                data: "userID=" + userID,
                dataType: "json",
                cache: false,
                success: function (response) {

                    if (response.deleted === "true") {
                        listUsers();
                    } else if (response.deleted === "false") {
                        alert("Error: Update failed.");
                    }
                }
            };

            MMS.utils.doAjax(deleteRequestObj);
        }
    };

    /**
     * Gets parameter
     * @param name
     * @param url
     * @returns {*}
     */
    const getParameterByName = function (name, url) {

        if (!url) {
            url = window.location.href;
        }

        name = name.replace(/[\[\]]/g, "\\$&");

        let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);

        if (!results) {
            return null;
        }

        if (!results[2]) {
            return '';
        }

        return decodeURIComponent(results[2].replace(/\+/g, " ")); // DOMPurify.sanitize()
    };

    /**
     * retrieves user's session information
     */
    getSessionInfo = function() {

        let token = getParameterByName('t');
        let uid = getParameterByName('uid');

        profileRequestObj = {
            type: "GET",
            url: MMS.configObj.profile + '?t=' + token + '&uid=' + uid,
            dataType: "json",
            cache: false,
            success: function (response) {
                response.token = token;
                sessionStorage.setItem("mms_profile", JSON.stringify(response));
                var profileObj = JSON.parse(sessionStorage.getItem("mms_profile"));
                var user = profileObj.firstName + " " + profileObj.lastName + " (" + profileObj.role + ")";
                $("#user-role").append(user);
            }
        };

        MMS.utils.doAjax(profileRequestObj);
    };

    /** TODO: re-evaluate this approach
     * loads form based on object type
     */
    loadForm = function(formType) {

        if (formType === "addUser") {
            constructUserAddForm();
            $('#search-results').empty();
            $(".current").html("Add User");
        } else if (formType === "viewUsers") {
            listUsers();
            $('#search-results').empty();
            $(".current").html("Users");
        }
    };

    /**
     * Hides form and binds load form event when dashboard is loaded
     */
    init = function() {

        $(userForms).hide();

        $("#addUser").on("click", function(event) {
            loadForm($(this).attr("id"));
        });

        $("#viewUsers").on("click", function(event) {
            loadForm($(this).attr("id"));
        });
    };

    return {
        init:function() {
            return init();
        },
        constructUserEditForm:function(userID) {
            return constructUserEditForm(userID);
        },
        deleteUserData:function(userID) {
            return deleteUserData(userID);
        },
        getSessionInfo:function() {
            return getSessionInfo();
        }
    };

}(jQuery));