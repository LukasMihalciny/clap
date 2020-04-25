'use strict';
const { shell } = require( 'electron' );

function Login() {
	this.dom = login_feedback.get_dom();
	this.add_listeners();
}

Login.prototype.add_listeners = function() {
	this.dom.open_token_page.addEventListener( 'click', function() { shell.openExternal( 'https://new.costlocker.com/api-token' ); } );
	this.dom.log_in_button.addEventListener( 'click', function() { this.log_me_in() }.bind( this ) );
	this.dom.log_out_button.addEventListener( 'click', function() { this.log_out() }.bind( this ) );
}

Login.prototype.log_me_in = function() {

	var token = this.dom.token_input.value;

	// validate
	if ( token === undefined || token === '' ) {
		// display error
		var error_object = {
			my_message: 'Invalid token.',
			error: 'token: ' + token
		}
		error_window.display( error_object );
	} else {
		// launch request
		login_feedback.loading();
		this.set_bearer( token );
		api_requests.user_detail();
	}

}

Login.prototype.set_bearer = function( token ) {
	// app name with token transformed into base64
	var app_name = 'clap' + ':' + token;
	var bearer = btoa( app_name );
	constants.token = token;
	constants.bearer = bearer;
	localStorage.setItem( 'token', token );
	localStorage.setItem( 'bearer', bearer );
}

Login.prototype.log_out = function() {
	constants.token = '';
	constants.bearer = '';
	constants.user = {};
	localStorage.removeItem( 'token' );
	localStorage.removeItem( 'bearer' );
	this.dom.token_input.value = '';
	login_feedback.out();
}

Login.prototype.on_startup_check_localstorage = function() {
	login_feedback.loading();
	var bearer = localStorage.getItem( 'bearer' );
	if ( bearer === null ) {
		login_feedback.out();
		return;
	}
	constants.bearer = bearer;
	// api_requests.user_detail(); <-- this was the main purpose, token is for testing
	var token = localStorage.getItem( 'token' );
	if ( token === null ) {
		login_feedback.out();
		return;
	}
	constants.token = token;
	this.dom.token_input.value = token;
	login_feedback.in();
}

/* init
**************************************************************************/
var login = new Login;

/* login on startup if bearer is present in localStorage
**************************************************************************/
login.on_startup_check_localstorage();
