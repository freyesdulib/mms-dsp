MMS.namespace("MMS.login");

MMS.login = (function($) {

    // ** dependencies ** //
    // MMS.utils
    // http://ajax.aspnetcdn.com/ajax/jquery.validate/1.9/jquery.validate.min.js

    "use strict";

    var authenticate,
        login,
        validate,
        requestObj,
        module = ".module width_full",
        loginForm = "#login-form",
        init,
        logout;

    /**
     * sends the user's login credentials to the server
     */
    authenticate = function() {

        requestObj = {
            type: "POST",
            url: MMS.configObj.authenticate,
            data: $(loginForm).serialize(),
            dataType: "json",
            cache: true,
            success: function (response) {
                $(module).hide();
                login(response);
            }
        };

         $("h3#message").ajaxStart(function() {
            $("#authenticate").attr("disabled", "disabled");
         });

        MMS.utils.doAjax(requestObj);

    };

    /**
     * checks the response and logs the user into the system
     * @param response
     */
    login = function(response) {

        if (response.isAuthenticated === false) {
            $("#error").html("<h4 class='alert_error'>Authentication Failed.</h4>");
            $("#authenticate").removeAttr("disabled");
        } else if(response.isAuthenticated === true) {
            window.location.replace(MMS.configObj.dashboard + response.redirect);
        }
    };

    /**
     * validates login form fields
     */
    validate = function() {
        $("#login-form").validate({
            errorClass: "invalid",
            rules: {
                userName: {
                    required: true,
                    digits: true,
                    minlength: 9
                },
                passWord: {
                    required: true
                }
            },
            messages: {
                userName: {
                    required: "Please enter your DU ID",
                    digits: "Please enter only digits",
                    minlength: "Please enter at least 9 digits"
                },
                passWord: {
                    required: "Please enter your Passcode"
                }
            },
            submitHandler: function() {
                authenticate();
            }
        });
    };

    /**
     * destroys session
     */
    logout = function() {
        $("#logout").click(function() {

            requestObj = {
                type: "GET",
                url: MMS.configObj.logout,
                dataType: "json",
                success: function (response) {
                    if (response.logout === "true") {
                        sessionStorage.removeItem("mms_profile");
                        window.location.replace(MMS.configObj.sslBaseUrl);
                    }
                }
            };

            MMS.utils.doAjax(requestObj);

        });

        return false;
    };

    init = function() {
        validate();
        logout();
    };

    return {
        init: function() {
            init();
        }
    };

}(jQuery));