'use strict';

const { shell } = require( 'electron' );

import constants from './constants.js';
import login from './login.js';
import running_entry from './running_entry.js';
import opened_projects from './opened_projects.js';

function Clap() {
	this.initialize();
}

Clap.prototype.initialize = function() {
	// what to run after startup
	var event_holder = document.getElementById( 'event_holder' );
	event_holder.addEventListener(
		'click',
		function( event ) {
			constants.set_clicked_target( event.target );
			this.click_events();
		}.bind( this )
	);
	var description_input = running_entry.input;
	description_input.addEventListener(
		'blur',
		function(){
			running_entry.hide_description_input();
		}.bind( this )
	);
	description_input.addEventListener(
		'keydown',
		function( event ){
			running_entry.change_description( event );
		}.bind( this )
	);
	var filter_input = opened_projects.filter_input;
	filter_input.addEventListener(
		'keyup',
		function( event ) {
			opened_projects.filter_buttons( event );
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
		running_entry.start_tracking();
	} else if ( target.id === 'stop_tracking' ) {
		running_entry.stop_tracking();
	} else if ( target.id === 'change_description' ) {
		running_entry.show_description_input();
	}
}

var clap = new Clap;
