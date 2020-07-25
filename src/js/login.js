'use strict';

const { shell } = require( 'electron' );

import constants from './submodules/constants.js';
import api_requests from './api_requests.js';
import error_window from './submodules/error_window.js';

function Login() {
	this.dom = this.get_dom();
}

Login.prototype.add_listeners = function() {
	this.dom.open_token_page.addEventListener( 'click', function() { shell.openExternal( 'https://new.costlocker.com/api-token' ); } );
	this.dom.log_in_button.addEventListener( 'click', function() { this.log_me_in() }.bind( this ) );
	this.dom.log_out_button.addEventListener( 'click', function() { this.log_out() }.bind( this ) );
	this.dom.reload.addEventListener( 'click', function() { api_requests.reload() }.bind( this ) );
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
		this.set_bearer( token );
		api_requests.user_detail();
	}
}

Login.prototype.set_bearer = function( token ) {
	// app name with token transformed into base64
	var app_name = 'clap' + ':' + token;
	var bearer = btoa( app_name );
	constants.set_token_bearer( token, bearer );
	localStorage.setItem( 'token', token );
	localStorage.setItem( 'bearer', bearer );
}

Login.prototype.log_out = function() {
	constants.clear_token_bearer();
	constants.clear_user();
	localStorage.removeItem( 'token' );
	localStorage.removeItem( 'bearer' );
	this.out();
}

Login.prototype.on_startup_check_localstorage = function() {
	/* login on startup if bearer is present in localStorage */

	// var bearer = localStorage.getItem( 'bearer' );
	// if ( bearer === null ) {
	// 	this.out();
	// 	return;
	// }
	// constants.bearer = bearer;
	// api_requests.user_detail(); <-- this was the main purpose, token is for testing
	var token = localStorage.getItem( 'token' );
	var bearer = localStorage.getItem( 'bearer' );
	if ( token === null ) {
		this.out();
		return;
	}
	this.dom.token_input.value = token;
	constants.set_token_bearer( token, bearer );
}

Login.prototype.get_dom = function() {
	return {
		open_token_page: document.getElementById( 'open_token_page' ),
		token_input: document.getElementById( 'token_input' ),
		log_in_button: document.getElementById( 'log_in_button' ),
		log_out_button: document.getElementById( 'log_out_button' ),
		login_name: document.getElementById( 'login_name' ),
		reload: document.getElementById( 'reload' )
	};
}

Login.prototype.in = function() {
	var user = constants.get_user_data();
	this.dom.login_name.innerHTML = 'Welcome ' + user.person.first_name + ' ' + user.person.last_name + ', ' + user.company.name;
	this.hide_all();
	this.dom.login_name.classList.remove( 'hidden' );
	this.dom.log_out_button.classList.remove( 'hidden' );
	this.dom.reload.classList.remove( 'hidden' );
}

Login.prototype.out = function() {
	this.hide_all();
	this.dom.login_name.innerHTML = '';
	this.dom.token_input.classList.remove( 'hidden' );
	this.dom.log_in_button.classList.remove( 'hidden' );
	this.dom.open_token_page.classList.remove( 'hidden' );
}

Login.prototype.hide_all = function() {
	for ( var key in this.dom ) {
		if ( this.dom.hasOwnProperty( key ) ) {
			var element = this.dom[key];
			if ( ! element.classList.contains( 'hidden' ) ) {
				element.classList.add( 'hidden' );
			}
		}
	}
}

export default new Login;
