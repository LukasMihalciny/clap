'use strict';

import constants from './constants.js';

function Opened_projects() {
	this.container = document.querySelector( '#projects > div' );
	this.button_html = '';
}

Opened_projects.prototype.display_them = function() {
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
	console.log( 'constants.cl_data: ' + typeof constants.cl_data ); console.log( constants.cl_data );
	this.container.innerHTML = '';
	var assignments = constants.cl_data.Simple_Tracking_Assignments;
	var i = 0, len = assignments.length;
	while ( i < len ) {
		console.log( 'assignments[i]: ' + typeof assignments[i] ); console.log( assignments[i] );
		var html = this.button_html;
		console.log( 'html: ' + typeof html ); console.log( html );
		html = html.replace( '{{person_id}}', assignments[i].assignment.person_id );
		html = html.replace( '{{project_id}}', assignments[i].assignment.project_id );
		html = html.replace( '{{activity_id}}', assignments[i].assignment.activity_id );
		html = html.replace( '{{task_id}}', assignments[i].assignment.task_id );
		html = html.replace( '{{project_name}}', assignments[i].names.project_name );
		html = html.replace( '{{activity_name}}', assignments[i].names.activity_name );
		html = html.replace( '{{task_name}}', assignments[i].names.task_name );
		console.log( 'html: ' + typeof html ); console.log( html );
		this.container.innerHTML += html;
	i++;
	}
}

export default new Opened_projects;
