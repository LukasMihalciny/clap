'use strict';

import constants from './constants.js';
import functions_dates from './functions_dates.js';

function Prepare_request_data() {}

Prepare_request_data.prototype.getting_cl_data = function() {
	var post_body = {
		'Simple_Projects': {},
		'Simple_Activities': {},
		'Simple_Timesheet': {
			'datef': functions_dates.current_date_in_request_format(),
			'datet': functions_dates.current_date_in_request_format()
		},
		'Simple_Tracking_Assignments': {},
		'Simple_Tracking_RunningEntry': {},
		'Simple_Tags': {}
	};
	post_body = JSON.stringify( post_body );
	return post_body;
}

Prepare_request_data.prototype.setting_entry = function() {
	var target = constants.get_clicked_target();
	if ( ! target.classList.contains( 'opened_project_button' ) ) {
		target = target.parentNode;
	}
	var post_body = {
		'data': [
			{
				'date': functions_dates.current_datetime_in_request_format(),
				'duration': null,
				'assignment': {
					// 'person_id': data.person_id,
					// 'project_id': data.project_id,
					// 'activity_id': data.activity_id,
					// 'task_id': data.task_id
				}
			}
		]
	};
	var data_names = [ 'person_id', 'project_id', 'activity_id', 'task_id' ];
	var i, len = data_names.length;
	for ( i = 0; i < len; i++ ) {
		if ( target.dataset[ data_names[i] ] === null || target.dataset[ data_names[i] ] === 'null' ) {
			continue;
		}
		post_body.data[0].assignment[ data_names[i] ] = target.dataset[ data_names[i] ];
	}
	return JSON.stringify( post_body );
}

Prepare_request_data.prototype.stopping_entry = function() {
	var running = constants.get_cl_data().Simple_Tracking_RunningEntry;
	var post_body = {
		'data': [
			{
				'uuid': running.uuid,
				// 'description': running.description
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

export default new Prepare_request_data;
