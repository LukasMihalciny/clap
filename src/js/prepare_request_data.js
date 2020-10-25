'use strict';

import constants from './constants.js';
import functions_dates from './functions_dates.js';


function Prepare_request_data() {}


/************************************************************************************/
/* assignments */
/************************************************************************************/
Prepare_request_data.prototype.getting_assignments = function() {

	var post_body = {
		'Simple_Projects': {},
		'Simple_Activities': {},
		'Simple_Timesheet': {
			'datef': functions_dates.yesterday_date_in_request_format(),
			'datet': functions_dates.current_date_in_request_format(),
			'nonproject': true
		},
		'Simple_Tracking_Assignments': {},
		'Simple_Tracking_RunningEntry': {},
		'Simple_Tags': {}
	};

	post_body = JSON.stringify( post_body );
	return post_body;

}


/************************************************************************************/
/* set entry */
/************************************************************************************/
Prepare_request_data.prototype.setting_entry = function() {

	var target = constants.get_clicked_target();
	if (
		! target.classList.contains( 'opened_project_button' ) &&
		! target.classList.contains( 'continue_project' )
	) {
		target = target.parentNode;
	}

	var post_body = {
		'data': [
			{
				'date': functions_dates.current_datetime_in_request_format(),
				'duration': null,
				'assignment': {}
			}
		]
	};

	if ( target.dataset.description !== null ) {
		post_body.data[0].description = target.dataset.description;
	}

	var data_names = [ 'person_id', 'project_id', 'activity_id', 'task_id' ];

	var i, len = data_names.length;
	for ( i = 0; i < len; i++ ) {

		if ( target.dataset[ data_names[i] ] === 'null' ) {
			post_body.data[0].assignment[ data_names[i] ] = null;
		}
		else {
			post_body.data[0].assignment[ data_names[i] ] = target.dataset[ data_names[i] ];
		}

	}

	return JSON.stringify( post_body );

}


/************************************************************************************/
/* stop entry */
/************************************************************************************/
Prepare_request_data.prototype.stopping_entry = function() {

	var running = constants.get_cl_data().Simple_Tracking_RunningEntry;

	var post_body = {
		'data': [
			{
				'uuid': running.uuid,
				'date': running.date,
				'duration': functions_dates.get_duration_in_seconds( running.date ),
				'assignment': running.assignment
			}
		]
	};

	if ( running.description === null || running.description === 'null' ) {
		post_body.data[0].description = '';
	} else {
		post_body.data[0].description = running.description;
	}

	return JSON.stringify( post_body );

}


/************************************************************************************/
/* change description */
/************************************************************************************/
Prepare_request_data.prototype.changing_description = function() {

	var running = constants.get_cl_data().Simple_Tracking_RunningEntry;

	var post_body = {
		'data': [
			{
				'uuid': running.uuid,
				'description': constants.get_running_description(),
				'date': running.date,
				'assignment': {
					'person_id': running.assignment.person_id,
					'project_id': running.assignment.project_id,
					'activity_id': running.assignment.activity_id,
					'task_id': running.assignment.task_id
				}
			}
		]
	};

	return JSON.stringify( post_body );

}


/************************************************************************************/
/* change project */
/************************************************************************************/
Prepare_request_data.prototype.changing_project = function() {

	var target = constants.get_clicked_target();
	if ( ! target.classList.contains( 'opened_project_button' ) ) {
		target = target.parentNode;
	}

	var running = constants.get_cl_data().Simple_Tracking_RunningEntry;

	var post_body = {
		'data': [
			{
				'uuid': running.uuid,
				'date': running.date,
				'assignment': {}
			}
		]
	};

	if ( running.description !== null ) {
		post_body.data[0].description = running.description;
	}

	var data_names = [ 'person_id', 'project_id', 'activity_id', 'task_id' ];

	var i, len = data_names.length;
	for ( i = 0; i < len; i++ ) {

		if ( target.dataset[ data_names[i] ] === 'null' ) {
			post_body.data[0].assignment[ data_names[i] ] = null;
		}
		else {
			post_body.data[0].assignment[ data_names[i] ] = target.dataset[ data_names[i] ];
		}

	}

	return JSON.stringify( post_body );

}


/************************************************************************************/
/* export class */
/************************************************************************************/
export default new Prepare_request_data;
