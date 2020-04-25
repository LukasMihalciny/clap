'use strict';

function State() {
	this.logged_in = false;
	this.token = '';
}

State.prototype.log_in_as = function( token ) {
	if ( token === undefined || token === '' ) {
		console.log( 'error' );
	}
	this.logged_in = true;
	this.token = token;
}
State.prototype.log_out = function() {
	this.logged_in = false;
	this.token = '';
}

/* init
**************************************************************************/
var state = new State;
