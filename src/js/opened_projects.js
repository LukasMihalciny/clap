'use strict';

import constants from './constants.js';
import api_requests from './api_requests.js';
import error_window from './error_window.js';
import running_entry from './running_entry.js';

function Opened_projects() {
	this.button_container = document.querySelector( '#projects > div.row' );
	this.button_html = ''; // component storage
}

Opened_projects.prototype.display_opened_projects = function() {
	api_requests.get_assignments_promise().then(
		result => {
			if ( api_requests.get_response_status_code() === 200 ) {
				// store cl_data
				constants.set_cl_data( result );
				// display them
				this.get_project_html();
				running_entry.get_tracking_html();
			} else {
				// display error
				var error_object = {
					my_message: 'Getting assignments failed.',
					error: result
				};
				error_window.display( error_object );
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
		// console.log( 'html: ' + typeof html ); console.log( html );
		this.button_container.innerHTML += html;
	i++;
	}
}

export default new Opened_projects;
