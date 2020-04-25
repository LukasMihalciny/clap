'use strict';
const { shell } = require( 'electron' );

function Login() {
	this.open_token_page = document.getElementById( 'open_token_page' );
	this.token_input = document.getElementById( 'token_input' );
	this.log_in_button = document.getElementById( 'log_in_button' );
	this.log_out_button = document.getElementById( 'log_out_button' );
	this.add_listeners();
}

Login.prototype.add_listeners = function() {
	this.open_token_page.addEventListener( 'click', function() { shell.openExternal( 'https://new.costlocker.com/api-token' ); } );
	this.log_in_button.addEventListener( 'click', function() { this.log_me_in() }.bind( this ) );
	this.log_out_button.addEventListener( 'click', function() { this.log_out() } );
}

Login.prototype.log_me_in = function() {

	var token = this.token_input.value;

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
	constants.logged_in = false;
	constants.token = '';
	constants.bearer = '';
	constants.user = {};
	localStorage.removeItem( 'token' );
	localStorage.removeItem( 'bearer' );
}

Login.prototype.on_startup_check_localstorage = function() {
	var bearer = localStorage.getItem( 'bearer' );
	if ( bearer === null ) {
		return;
	}
	constants.bearer = bearer;
	// api_requests.user_detail(); this was the main purpose, token is for testing
	var token = localStorage.getItem( 'token' );
	if ( token === null ) {
		return;
	}
	constants.token = token;
	this.token_input.value = token;
}

/* init
**************************************************************************/
var login = new Login;

/* login on startup if bearer is present in localStorage
**************************************************************************/
login.on_startup_check_localstorage();
