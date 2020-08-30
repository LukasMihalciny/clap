'use strict';

import constants from './constants.js';
import api_requests from './api_requests.js';
import error_window from './error_window.js';
import functions_dates from './functions_dates.js';
import todays_timesheet from './todays_timesheet.js';

function Running_entry() {
	this.tracking_container = document.getElementById( 'currently_tracking' );
	this.currently_tracking_html = ''; // component storage
	this.track_duration_running = false; // state
}

Running_entry.prototype.start_tracking = function() {
	api_requests.set_running_entry_promise().then(
		result => {
			if ( api_requests.get_response_status_code() === 200 ) {
				// started tracking project successful
				this.refresh_asignments();
			} else {
				// display error
				error_window.display( result, 'Tracking project failed.' );
			}
		}
	);
}

Running_entry.prototype.stop_tracking = function() {
	var running = constants.get_cl_data().Simple_Tracking_RunningEntry;
	if ( running === null ) {
		error_window.display( {}, 'There is no running entry. Nothing to stop.' );
		return;
	}
	api_requests.stop_running_entry_promise().then(
		result => {
			if ( api_requests.get_response_status_code() === 200 ) {
				// success
				this.refresh_asignments();
			} else {
				// display error
				error_window.display( result, 'Stopping project failed.' );
			}
		}
	);
}

Running_entry.prototype.show_description_input = function() {
	var running = constants.get_cl_data().Simple_Tracking_RunningEntry;
	if ( running === null ) {
		error_window.display( {}, 'There is no running entry. Can not change description.' );
		return;
	}
	var buttons = document.querySelectorAll( '#currently_tracking .btn' );
	var input = document.getElementById( 'description_input' );
	var i, len = buttons.length;
	for ( i = 0; i < len; i++ ) {
		buttons[i].classList.add( 'hidden' );
	}
	input.classList.remove( 'hidden' );
	// MOVE ADDING LISTENER TO _script.js when it is out of component
	input.addEventListener( 'blur', function(){ this.change_description() }.bind( this ) );
	input.addEventListener( 'keydown', function(event){ this.change_description(event) }.bind( this ) );
}
Running_entry.prototype.hide_description_input = function() {
	var buttons = document.querySelectorAll( '#currently_tracking .btn' );
	var input = document.getElementById( 'description_input' );
	var i, len = buttons.length;
	for ( i = 0; i < len; i++ ) {
		buttons[i].classList.remove( 'hidden' );
	}
	input.classList.add( 'hidden' );
	// STOP REMOVING EVENT LISTENER
	input.removeEventListener( 'blur', function(){ this.change_description() }.bind( this ) );
	input.removeEventListener( 'keydown', function(event){ this.change_description(event) }.bind( this ) );
}

Running_entry.prototype.change_description = function(event) {
	if (
		event !== undefined // is not blur but keydown
		&& ( event.keyCode !== 13 && event.keyCode !== 9 ) // neither Enter or Tab was pressed
	) {
		return;
	}
	this.hide_description_input();
	return;
	// CONTINUE HERE
	// CHECK IF VALUE CHANGED
	// GATHER VALUE
	// LAUNCH PROMISE
	api_requests.change_running_entry_promise().then(
		result => {
			if ( api_requests.get_response_status_code() === 200 ) {
				// success
				// error_window.display( result, 'Changing project succeeded !!' );
				this.refresh_asignments();
			} else {
				// display error
				error_window.display( result, 'Changing project failed.' );
			}
		}
	);
}

Running_entry.prototype.refresh_asignments = function() {
	api_requests.get_assignments_promise().then(
		result => {
			if ( api_requests.get_response_status_code() === 200 ) {
				// store cl_data
				constants.set_cl_data( result );
				// display running entry
				this.show_currently_running();
				// display todays projects
				todays_timesheet.display_todays();
			} else {
				// display error
				error_window.display( result, 'Getting assignments failed.' );
			}
		}
	);
}

Running_entry.prototype.show_currently_running = function() {
	// saving component
	fetch(
		'../components/currently_tracking_content.html'
	).then(
		response => {
			return response.text();
		}
	).then(
		result => {
			this.currently_tracking_html = result;
			this.fill_tracking_project();
		}
	).catch( error => console.log( error ) );
}

Running_entry.prototype.fill_tracking_project = function() {
	// display tracking of currently running entry
	this.tracking_container.innerHTML = '';
	var running_entry = constants.get_cl_data().Simple_Tracking_RunningEntry;
	var html = this.currently_tracking_html;
	if ( running_entry === null ) {
		html = html.replace( '{{project_name}}', '' );
		html = html.replace( '{{description}}', '' );
		html = html.replace( '{{client_name}}', '' );
		html = html.replace( '{{activity_name}}', '' );
		html = html.replace( '{{task_name}}', '' );
		html = html.replace( '{{started}}', '' );
		html = html.replace( '{{duration}}', '' );
		this.tracking_container.innerHTML = html;
		this.track_duration_stop();
	} else {
		html = html.replace( '{{project_name}}', running_entry.names.project_name );
		html = html.replace( '{{description}}', running_entry.description );
		html = html.replace( '{{client_name}}', running_entry.names.client_name );
		html = html.replace( '{{activity_name}}', running_entry.names.activity_name );
		html = html.replace( '{{task_name}}', running_entry.names.task_name );
		this.tracking_container.innerHTML = html;
		this.track_duration_start();
	}
}

Running_entry.prototype.track_duration_start = function() {
	this.track_duration_running = true;
	this.track_duration();
}
Running_entry.prototype.track_duration_stop = function() {
	this.track_duration_running = false;
}
Running_entry.prototype.track_duration = function() {
	if ( this.track_duration_running === false ) {
		return;
	}
	// calculate timings of currently running entry
	var started = constants.get_cl_data().Simple_Tracking_RunningEntry.date;
	started = new Date( started );
	started = functions_dates.convert_date_to_utc( started );
	var duration = new Date() - started;
	duration = new Date( duration );
	duration = functions_dates.convert_date_to_utc( duration );
	// write
	var started_html = document.getElementById( 'started' );
	var duration_html = document.getElementById( 'duration' );
	started_html.innerHTML = functions_dates.convert_date_to_readable_format( started );
	duration_html.innerHTML = functions_dates.convert_date_to_readable_format( duration );
	// repeat every 1 second until stopped
	setTimeout(
		function() {
			this.track_duration();
		}.bind( this ),
		1000
	);
}

export default new Running_entry;
