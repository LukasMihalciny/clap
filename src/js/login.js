'use strict';
const { shell } = require( 'electron' );

function Login() {
	this.open_token_page = document.getElementById( 'open_token_page' );
	this.token_input = document.getElementById( 'token_input' );
	this.log_in_button = document.getElementById( 'log_in_button' );
	this.add_listeners();
}

Login.prototype.add_listeners = function() {
	this.open_token_page.addEventListener( 'click', function() { shell.openExternal( 'https://new.costlocker.com/api-token' ); } );
	this.log_in_button.addEventListener( 'click', function() { this.log_me_in() }.bind( this ) );
}

Login.prototype.log_me_in = function() {
	var error_object = {
		my_message: 'dpwq oqwpoj dqwop',
		error: {
			pqweq: 'po qwkd pqodwqo d',
			qwe: 2324,
			pqwodq: 'dpqw opqw dopq'
		}
	}
	error_window.display( error_object );
}

/* init
**************************************************************************/
var login = new Login;
