'use strict';

import constants from './constants.js';
import api_requests from '../api_requests.js';
import error_window from './error_window.js';

function Running_entry() {
	this.tracking_container = document.getElementById( 'currently_tracking' );
	this.currently_tracking_html = ''; // component storage
	this.track_duration_running = false; // state
}

Running_entry.prototype.display_currently_tracking	= function() {
	api_requests.set_running_entry_promise().then(
		result => {
			if ( api_requests.get_response_status_code() === 200 ) {
				// started tracking project successful
				api_requests.get_assignments_promise();
			} else {
				// display error
				var error_object = {
					my_message: 'Tracking project failed.',
					error: result
				};
				error_window.display( error_object );
			}
		}
	);
}

Running_entry.prototype.get_tracking_html = function() {
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
	started = this.convert_date_to_utc( started );
	var duration = new Date() - started;
	duration = new Date( duration );
	duration = this.convert_date_to_utc( duration );
	// write
	var started_html = document.getElementById( 'started' );
	var duration_html = document.getElementById( 'duration' );
	started_html.innerHTML = this.convert_date_to_readable_format( started );
	duration_html.innerHTML = this.convert_date_to_readable_format( duration );
	// repeat every 1 second until stopped
	setTimeout(
		function() {
			this.track_duration();
		}.bind( this ),
		1000
	);
}

Running_entry.prototype.convert_date_to_utc = function ( date ) {
	return new Date(
		date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()
	);
}
Running_entry.prototype.convert_date_to_readable_format = function( date ) {
	return ( '0' + date.getHours() ).slice(-2) +
	':' +
	( '0' + date.getMinutes() ).slice(-2) +
	':' +
	( '0' + date.getSeconds() ).slice(-2);
}

export default new Running_entry;
