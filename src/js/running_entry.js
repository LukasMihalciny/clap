'use strict';

import constants from './constants.js';
import api_requests from './api_requests.js';
import error_window from './error_window.js';
import functions_dates from './functions_dates.js';
import todays_timesheet from './todays_timesheet.js';


function Running_entry() {

	this.tracking_holder = document.getElementById( 'tracking_holder' );
	this.buttons = document.querySelectorAll( '#currently_tracking .btn' );
	this.input = document.getElementById( 'description_input' );
	this.currently_tracking_html = ''; // component storage
	this.track_duration_running = false; // state

}


/************************************************************************************/
/* start */
/************************************************************************************/
Running_entry.prototype.start_tracking = function() {

	var running = constants.get_cl_data().Simple_Tracking_RunningEntry;

	// new project
	if ( running === null ) {

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
	// change project
	else {

		api_requests.change_running_entry_project().then(
			result => {

				if ( api_requests.get_response_status_code() === 200 ) {
					// started tracking project successful
					this.refresh_asignments();
				} else {
					// display error
					error_window.display( result, 'Changing project failed.' );
				}

			}
		);

	}

}


/************************************************************************************/
/* stop */
/************************************************************************************/
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


/************************************************************************************/
/* description show hide */
/************************************************************************************/
Running_entry.prototype.show_description_input = function() {

	var running = constants.get_cl_data().Simple_Tracking_RunningEntry;

	if ( running === null ) {
		error_window.display( {}, 'There is no running entry. Can not change description.' );
		return;
	}

	var i, len = this.buttons.length;
	for ( i = 0; i < len; i++ ) {
		this.buttons[i].classList.add( 'hidden' );
	}

	this.input.value = constants.get_running_description();
	this.input.classList.remove( 'hidden' );
	this.input.focus();

}

Running_entry.prototype.hide_description_input = function() {

	var i, len = this.buttons.length;
	for ( i = 0; i < len; i++ ) {
		this.buttons[i].classList.remove( 'hidden' );
	}
	this.input.classList.add( 'hidden' );

}


/************************************************************************************/
/* description change */
/************************************************************************************/
Running_entry.prototype.change_description = function(event) {

	if ( event.type === 'keydown' && event.keyCode === 27 ) {
		// cancel on Esc
		this.hide_description_input();
		return;
	} else if ( event.type === 'keydown' && event.keyCode !== 13 && event.keyCode !== 9 ) {
		// do nothing if not Enter or Tab
		return;
	}

	constants.set_running_description( this.input.value );
	this.hide_description_input();

	api_requests.change_running_entry_description().then(
		result => {

			if ( api_requests.get_response_status_code() === 200 ) {
				// success
				this.refresh_asignments();
			} else {
				// display error
				error_window.display( result, 'Changing description failed.' );
			}

		}
	);

}


/************************************************************************************/
/* refresh */
/************************************************************************************/
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
				error_window.display( result, 'Getting asignments failed.' );
			}

		}
	);

}


/************************************************************************************/
/* saving html component */
/************************************************************************************/
Running_entry.prototype.show_currently_running = function() {

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


/************************************************************************************/
/* display tracking of currently running entry */
/************************************************************************************/
Running_entry.prototype.fill_tracking_project = function() {

	this.tracking_holder.innerHTML = '';
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
		this.tracking_holder.innerHTML = html;
		this.track_duration_stop();

	} else {

		html = html.replace( '{{project_name}}', running_entry.names.project_name );
		html = html.replace( '{{client_name}}', running_entry.names.client_name );
		html = html.replace( '{{activity_name}}', running_entry.names.activity_name );
		if ( running_entry.description === null ) {
			html = html.replace( '{{description}}', '' );
		} else {
			html = html.replace( '{{description}}', running_entry.description );
		}
		if ( running_entry.names.task_name === null ) {
			html = html.replace( '{{task_name}}', '' );
		} else {
			html = html.replace( '{{task_name}}', running_entry.names.task_name );
		}
		this.tracking_holder.innerHTML = html;
		this.track_duration_start();
		constants.set_running_description( running_entry.description );

	}

}


/************************************************************************************/
/* tracking duration, calculate timings of currently running entry */
/************************************************************************************/
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

	var started = constants.get_cl_data().Simple_Tracking_RunningEntry.date;
	started = new Date( started );
	started = functions_dates.convert_date_to_utc( started );

	var duration = new Date() - started;
	duration = new Date( duration );
	duration = functions_dates.convert_date_to_utc( duration );

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


/************************************************************************************/
/* export class */
/************************************************************************************/
export default new Running_entry;
