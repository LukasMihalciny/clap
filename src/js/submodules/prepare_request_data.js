'use strict';

import constants from './constants.js';

function Prepare_request_data() {}

Prepare_request_data.prototype.setting_entry = function() {
	var target = constants.get_clicked_target();
	if ( ! target.classList.contains( 'opened_project_button' ) ) {
		target = target.parentNode;
	}
	var post_body = {
		'data': [
			{
				// 'uuid': 'b0537a3d-ee6e-45d1-8734-2b4cdc00cfb3',
				// 'description': 'TEST2',
				'date': this.current_datetime_in_request_format(),
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

Prepare_request_data.prototype.current_datetime_in_request_format = function() {
	// '2020-08-23T10:30:26+0000'
	var now = new Date();
	return now.getFullYear() +
	'-' +
	( '0' + (now.getMonth()+1) ).slice(-2) +
	'-' +
	( '0' + now.getDate() ).slice(-2) +
	'T' +
	( '0' + now.getHours() ).slice(-2) +
	':' +
	( '0' + now.getMinutes() ).slice(-2) +
	':' +
	( '0' + now.getSeconds() ).slice(-2) +
	'+0000';
}

export default new Prepare_request_data;
