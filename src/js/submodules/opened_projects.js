'use strict';

import constants from './constants.js';

function Opened_projects() {
	this.button_container = document.querySelector( '#projects > div.row' );
	this.button_html = ''; // component storage
	this.tracking_container = document.getElementById( 'currently_tracking' );
	this.currently_tracking_html = ''; // component storage
	this.track_duration_running = false; // state
}

Opened_projects.prototype.display_opened_projects = function() {
	// saving component
	fetch(
		'../components/opened_project_button.html'
	).then(
		response => {
			return response.text();
		}
	).then(
		result => {
			this.button_html = result;
			this.fill_buttons();
		}
	).catch( error => console.log( error ) );
}

Opened_projects.prototype.fill_buttons = function() {
	// display all awavilable projects as buttons
	this.button_container.innerHTML = '';
	var assignments = constants.get_cl_data().Simple_Tracking_Assignments;
	var i = 0, len = assignments.length;
	while ( i < len ) {
		// console.log( 'assignments[i]: ' + typeof assignments[i] ); console.log( assignments[i] );
		var html = this.button_html;
		// console.log( 'html: ' + typeof html ); console.log( html );
		if ( assignments[i].names.project_name === null ) {
			i++; continue;
		}
		html = html.replace( '{{person_id}}', assignments[i].assignment.person_id );
		html = html.replace( '{{project_id}}', assignments[i].assignment.project_id );
		html = html.replace( '{{activity_id}}', assignments[i].assignment.activity_id );
		html = html.replace( '{{task_id}}', assignments[i].assignment.task_id );
		html = html.replace( '{{project_name}}', assignments[i].names.project_name );
		html = html.replace( '{{activity_name}}', assignments[i].names.activity_name );
		if ( assignments[i].names.task_name === null ) {
			html = html.replace( '{{task_name}}', '' );
		} else {
			html = html.replace( '{{task_name}}', assignments[i].names.task_name );
		}
		// console.log( 'html: ' + typeof html ); console.log( html );
		this.button_container.innerHTML += html;
	i++;
	}
}

Opened_projects.prototype.display_currently_tracking = function() {
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

Opened_projects.prototype.fill_tracking_project = function() {
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

Opened_projects.prototype.track_duration_start = function() {
	this.track_duration_running = true;
	this.track_duration();
}
Opened_projects.prototype.track_duration_stop = function() {
	this.track_duration_running = false;
}
Opened_projects.prototype.convert_date_to_utc = function ( date ) {
	return new Date(
		date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()
	);
}
Opened_projects.prototype.convert_date_to_readable_format = function( date ) {
	return ( '0' + date.getHours() ).slice(-2) +
	':' +
	( '0' + date.getMinutes() ).slice(-2) +
	':' +
	( '0' + date.getSeconds() ).slice(-2);
}
Opened_projects.prototype.track_duration = function() {
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

export default new Opened_projects;
