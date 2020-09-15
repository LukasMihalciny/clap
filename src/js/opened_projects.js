'use strict';

import constants from './constants.js';
import api_requests from './api_requests.js';
import error_window from './error_window.js';
import running_entry from './running_entry.js';
import todays_timesheet from './todays_timesheet.js';

function Opened_projects() {
	this.button_container = document.getElementById( 'projects_wrap' );
	this.button_html = ''; // component storage
	this.filter_input = document.getElementById( 'filter_projects' );
}

Opened_projects.prototype.display_opened_projects = function() {
	api_requests.get_assignments_promise().then(
		result => {
			if ( api_requests.get_response_status_code() === 200 ) {
				// store cl_data
				constants.set_cl_data( result );
				// display them
				this.get_project_html();
				// display running entry
				running_entry.show_currently_running();
				// display todays projects
				todays_timesheet.display_todays();
			} else {
				// display error
				error_window.display( result, 'Getting assignments failed.' );
			}
		}
	);
}

Opened_projects.prototype.get_project_html = function() {
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
		var filter_string = [ assignments[i].names.project_name, assignments[i].names.activity_name, assignments[i].names.task_name ].join( ' ' ).toLowerCase();
		html = html.replace( '{{search_values}}', filter_string );
		// console.log( 'html: ' + typeof html ); console.log( html );
		this.button_container.innerHTML += html;
	i++;
	}
}

Opened_projects.prototype.filter_buttons = function( event ) {
	var filter_string = event.target.value.toLowerCase();
	var buttons = document.getElementsByClassName( 'opened_project_button' );
	var i, len = buttons.length;
	for ( i = 0; i < len; i++ ) {
		var search_values = buttons[i].dataset.search_values;
		var column = buttons[i].parentNode;
		if ( search_values.indexOf( filter_string ) > -1 ) {
			if ( column.classList.contains( 'hidden' ) ) {
				column.classList.remove( 'hidden' );
			}
		} else {
			if ( ! column.classList.contains( 'hidden' ) ) {
				column.classList.add( 'hidden' );
			}
		}
	}
}

export default new Opened_projects;
