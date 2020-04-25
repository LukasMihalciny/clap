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
	this.log_out_button.addEventListener( 'click', function() { constants.log_out() } );
}

Login.prototype.log_me_in = function() {

	var token = this.token_input.value;

	// validate
	if ( token === undefined || token === '' ) {
		// display error
		var error_object = {
			my_message: 'Invalid token.',
			error: {
				token: token
			}
		}
		error_window.display( error_object );
	} else {
		// launch request
		constants.set_token( token );
		api_requests.user_detail();
	}

}

/* init
**************************************************************************/
var login = new Login;
