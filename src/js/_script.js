'use strict';

const { shell } = require( 'electron' );

import constants from './submodules/constants.js';
import login from './login.js';
import api_requests from './api_requests.js';
import running_entry from './submodules/running_entry.js';

function Clap() {
	this.initialize();
}

Clap.prototype.initialize = function() {
	// what to run after startup
	this.event_holder = document.getElementById( 'event_holder' );
	this.event_holder.addEventListener(
		'click',
		function( event ) {
			constants.set_clicked_target( event.target );
			this.click_events()
		}.bind( this )
	);
	login.on_startup_check_localstorage();
}

Clap.prototype.click_events = function() {
	// all click event happening inside the main window
	var target = constants.get_clicked_target();
	if ( target.id === 'open_token_page' ) {
		shell.openExternal( 'https://new.costlocker.com/api-token' );
	} else if ( target.id === 'log_in_button' ) {
		login.log_me_in();
	} else if ( target.id === 'log_out_button' ) {
		login.log_out();
	} else if (
		target.classList.contains( 'opened_project_button' ) ||
		target.parentNode.classList.contains( 'opened_project_button' )
	) {
		running_entry.display_currently_tracking();
	}
}

var clap = new Clap;
