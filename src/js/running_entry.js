'use strict';

import constants from './constants.js';
import api_requests from './api_requests.js';
import opened_projects from './opened_projects.js';
import error_window from './error_window.js';
import functions_dates from './functions_dates.js';

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
				opened_projects.display_opened_projects();
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
				opened_projects.display_opened_projects();
			} else {
				// display error
				error_window.display( result, 'Stopping project failed.' );
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
