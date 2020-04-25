'use strict';

function Login_feedback() {
	this.dom = this.get_dom();
	this.logged = false;
	this.loading_counter = 0;
	this.loading_in_progress = false;
}

Login_feedback.prototype.get_dom = function() {
	return {
		open_token_page: document.getElementById( 'open_token_page' ),
		token_input: document.getElementById( 'token_input' ),
		log_in_button: document.getElementById( 'log_in_button' ),
		log_out_button: document.getElementById( 'log_out_button' ),
		login_loading: document.getElementById( 'login_loading' ),
		login_name: document.getElementById( 'login_name' )
	};
}

Login_feedback.prototype.in = function() {
	this.hide_all();
	this.dom.login_name.classList.remove( 'hidden' );
	this.dom.log_out_button.classList.remove( 'hidden' );
	this.loading_counter = 0;
	this.loading_in_progress = false;
}

Login_feedback.prototype.out = function() {
	this.hide_all();
	this.dom.token_input.classList.remove( 'hidden' );
	this.dom.log_in_button.classList.remove( 'hidden' );
	this.dom.open_token_page.classList.remove( 'hidden' );
}

Login_feedback.prototype.loading = function() {
	this.hide_all();
	this.dom.login_loading.classList.remove( 'hidden' );
	this.loading_in_progress = true;
	this.add_dots();
}

Login_feedback.prototype.add_dots = function() {
	setTimeout(
		function() {
			this.dom.login_loading.innerHTML += '.';
			this.loading_counter++;
			if ( this.loading_counter > 10 ) {
				this.dom.login_loading.innerHTML = 'Connecting';
				this.loading_counter = 0;
			}
			if ( this.loading_in_progress === true ) {
				this.add_dots();
			}
		}.bind( this ),
		100
	);
}

Login_feedback.prototype.hide_all = function() {
	for ( var key in this.dom ) {
		if ( this.dom.hasOwnProperty( key ) ) {
			var element = this.dom[key];
			if ( ! element.classList.contains( 'hidden' ) ) {
				element.classList.add( 'hidden' );
			}
		}
	}
}

/* init
**************************************************************************/
var login_feedback = new Login_feedback;
