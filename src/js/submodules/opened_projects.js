'use strict';

import constants from './constants.js';

function Opened_projects() {
	this.button_container = document.querySelector( '#projects > div.row' );
	this.button_html = '';
	this.tracking_container = document.getElementById( 'currently_tracking' );
	this.currently_tracking_html = '';
}

Opened_projects.prototype.display_opened_projects = function() {
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
	} else {
		var started = running_entry.date;
		var now = new Date();
		started = new Date( started );
		console.log( 'now: ' + typeof now ); console.log( now );
		console.log( 'now.getTime(): ' + typeof now.getTime() ); console.log( now.getTime() );
		console.log( 'started: ' + typeof started ); console.log( started );
		console.log( 'started.getTime(): ' + typeof started.getTime() ); console.log( started.getTime() );
		console.log( 'started - now: ' + typeof started - now ); console.log( started - now );
		console.log( 'now.toLocaleString(): ' + typeof now.toLocaleString() ); console.log( now.toLocaleString() );
		console.log( 'started.toLocaleString(): ' + typeof started.toLocaleString() ); console.log( started.toLocaleString() );
		var diff = now - started;
		diff = new Date( diff );
		console.log( 'diff: ' + typeof diff ); console.log( diff );
		console.log( 'diff.getHours(): ' + typeof diff.getHours() ); console.log( diff.getHours() );
		console.log( 'diff.getMinutes(): ' + typeof diff.getMinutes() ); console.log( diff.getMinutes() );
		console.log( 'diff.getSeconds(): ' + typeof diff.getSeconds() ); console.log( diff.getSeconds() );
		started = started.getHours() + ':' + started.getMinutes() + ':' + started.getSeconds();
		html = html.replace( '{{project_name}}', running_entry.names.project_name );
		html = html.replace( '{{description}}', running_entry.description );
		html = html.replace( '{{client_name}}', running_entry.names.client_name );
		html = html.replace( '{{activity_name}}', running_entry.names.activity_name );
		html = html.replace( '{{task_name}}', running_entry.names.task_name );
		html = html.replace( '{{started}}', started );
		html = html.replace( '{{duration}}', '00:00:00' );
	}
	this.tracking_container.innerHTML = html;
}

export default new Opened_projects;
