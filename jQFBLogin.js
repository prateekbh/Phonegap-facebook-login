(function($){
    $.fn.jQFBLogin = function (fb_client_id, fb_secret_key) {
        var that = $(this);
            $(this).tap(function () {
            		// opens a child browser for a valid facebook code
                var ref = window.open('https://graph.facebook.com/oauth/authorize?client_id='+fb_client_id+'&display=touch&redirect_uri=http://www.facebook.com/connect/login_success.html', '_blank', 'location=no');
                // adding a event listener for detecting various re-directions
                ref.addEventListener('loadstart', function (event) {
                		// check if we are now navigated to the success page
                    if (event.url.indexOf("connect/login_success.html") > -1) {
                    		//extract the facebook code
                        var fbCode = event.url.match(/code=(.*)$/)[1];
                        //now getting facebook access token plugin
                        var _url = 'https://graph.facebook.com/oauth/access_token?client_id='+fb_client_id+'&client_secret='+fb_secret_key+'&redirect_uri=http://www.facebook.com/connect/login_success.html&code=' + fbCode;
                        $.ajax({
                            url: _url,
                            data: {},
                            dataType: 'text',
                            type: 'POST',
                            success: function (data, status) {
                                var access_token = (data.split("=")[1]).substr(0, access_token.indexOf("&"));
                                //setting the token in local storage so that it can be used futher if any further api calls is to be made
                                localStorage.setItem(facebook_token, access_token);
                                //ask for user info in fields 
                                var infoURL = 'https://graph.facebook.com/me?access_token=' + access_token + '&fields=first_name,last_name,birthday,email,gender,id';
                                $.ajax({
                                    url: infoURL,
                                    type: 'GET',
                                    success: function (data, status) {
                                        var e = $.Event("fbLoggedIn");	//listen for this event
                                        e.response = data;
                                        $(document).trigger(e);	//trigger event successful login
                                    },
                                    error: function (error) {
                                        var e = $.Event("fbError"); //listen for this event
                                        e.response="Error getting user info";
                                        $(document).trigger(e);	//trigger event for un-successful login
                                    }
                                });
                                ref.close();
                            },
                            error: function (error) {
                                var e = $.Event("fbError"); //listen for this event
                                e.response = "Error getting access token";
                                $(document).trigger(e); //trigger event for un-successful login
                                ref.close();
                            }
                        });
                    }
                });
            });
    }
}(jQuery));
