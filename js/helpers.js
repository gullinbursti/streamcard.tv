
function isEmail(email) {
	var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return (regex.test(email));
}

function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function truncate(val, amt) {
	return ((val.length > amt) ? (val.substring(0, amt - 1) + "…") : (val));
}

function getCookie(key) {
	var val = "";

	var cookies = document.cookie.split(';');
	for (var i=0; i<cookies.length; i++) {
		var c = cookies[i];
		while (c.charAt(0) == ' ')
			c = c.substring(1);

		if (c.indexOf(key) != -1) {
			val = c.split("=")[1];
			break;
		}
	}

	return (val);
}

function setCookie(key, val) {
	var d = new Date();
	d.setDate(d.getDate() + 365);
	document.cookie = key+"="+val+"; expires="+d.toUTCString();
}

function deleteCookie(key) {
	document.cookie = key + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}


var queryString = {};
window.location.href.replace(
	new RegExp("([^?=&]+)(=([^&]*))?", "g"),
	function($0, $1, $2, $3) { queryString[$1] = $3; }
);