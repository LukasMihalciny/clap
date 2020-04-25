'use strict';

function Constants() {
	this.logged_in = false;
	this.token = '';
	this.bearer = '';
	this.user = {};
}

Constants.prototype.set_token = function( token ) {
	this.token = token;
	// create bearer - app name with token transformed into base64
	var app_name = 'clap' + ':' + token;
	this.bearer = btoa( app_name );
}

Constants.prototype.get_authorization = function() {
	return 'Basic ' + this.bearer;
}

Constants.prototype.log_out = function() {
	this.logged_in = false;
	this.token = '';
	this.bearer = '';
	this.user = {};
}

/* init
**************************************************************************/
var constants = new Constants;
