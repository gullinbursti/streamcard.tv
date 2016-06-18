

var auth_token = "";


function twitchAuth() {
	// not returning from auth
	if (!window.location.hash) {

		// doesn't have token stored
		if (getCookie('twitch_oauth_token') == "") {
			setCookie('channel', channel);

			// localhost redirect
			if (location.hostname == "localhost")
				location.href = "https://api.twitch.tv/kraken/oauth2/authorize?action=authorize&client_id=bdmreezjx7g0syk09kyzmkds978vrdj&login=&login_type=login&redirect_uri=http%3A%2F%2Flocalhost%2Fcard.html&response_type=token&scope=user_read+channel_subscriptions+chat_login&utf8=%E2%9C%93&force_verify=false";

			// live app redirect
			else {
				location.href = "https://api.twitch.tv/kraken/oauth2/authorize?action=authorize&client_id=kn6iwqzezy1kir29dvrleq4m0bf1t87&login=&login_type=login&redirect_uri=http%3A%2F%2Fstreamcard.tv%2Fcard.html&response_type=token&scope=user_read+channel_subscriptions+chat_login&utf8=%E2%9C%93&force_verify=false";
			}
		}

	} else {
		// twitch oauth token from fragment
		auth_token = window.location.hash.split("&")[0].replace("#access_token=", "");
		setCookie('twitch_oauth_token', auth_token);

		location.href = "/card.html?channel="+getCookie('channel');
	}
}


$(document).ready(function() {
	//setCookie('channel', channel);
});