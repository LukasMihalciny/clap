'use strict';

import constants from './submodules/constants.js';
import login from './login.js';
import error_window from './submodules/error_window.js';
import opened_projects from './submodules/opened_projects.js';
import running_entry from './submodules/running_entry.js';

/**
 * CL documentation https://costlocker.docs.apiary.io/#reference/0/rest-api-v2
*/

function Api_requests() {}

Api_requests.prototype.user_detail = function() {
	var headers = new Headers();
	headers.append( 'Authorization', constants.get_authorization() );
	var requestOptions = {
		method: 'GET',
		headers: headers,
		redirect: 'follow'
	};
	var storage = {};
	fetch(
		'https://new.costlocker.com/api-public/v2/me',
		requestOptions
	).then(
		response => {
			// save response headers into storage
			storage = response;
			return response;
		}
	).then(
		response => {
			// parse response text
			return response.text();
		}
	).then(
		result => {
			if ( storage.status === 200 ) {
				// store user
				constants.set_user( result );
				login.in();
				// reload displayed projects
				this.reload();
			} else {
				// display error
				login.out();
				var error_object = {
					my_message: 'Login API failed.',
					error: result
				};
				error_window.display( error_object );
			}
		}
	).catch(
		error => {
			console.log( 'error: ' + typeof error ); console.log( error );
		}
	);
}

Api_requests.prototype.reload = function() {
	this.get_assignments();
}

Api_requests.prototype.get_assignments = function() {
	var headers = new Headers();
	headers.append( 'Authorization', constants.get_authorization() );
	headers.append( 'Content-Type', 'application/json' );
	var post_body = {
		'Simple_Projects': {},
		'Simple_Activities': {},
		'Simple_Timesheet': {
			'datef': '2016-11-01',
			'datet': '2016-11-30'
		},
		'Simple_Tracking_Assignments': {},
		'Simple_Tracking_RunningEntry': {},
		'Simple_Tags': {}
	};
	post_body = JSON.stringify( post_body );
	var requestOptions = {
		method: 'POST',
		headers: headers,
		redirect: 'follow',
		body: post_body
	};
	var storage = {};
	fetch(
		'https://new.costlocker.com/api-public/v1/',
		requestOptions
	).then(
		response => {
			// save response headers into storage
			storage = response;
			return response;
		}
	).then(
		response => {
			// parse response text
			return response.text();
		}
	).then(
		result => {
			if ( storage.status === 200 ) {
				// store cl_data
				constants.set_cl_data( result );
				// display them
				opened_projects.display_opened_projects();
				running_entry.display_currently_tracking();
			} else {
				// display error
				var error_object = {
					my_message: 'Getting assignments failed.',
					error: result
				};
				error_window.display( error_object );
			}
		}
	).catch(
		error => {
			console.log( 'error: ' + typeof error ); console.log( error );
		}
	);
}

Api_requests.prototype.set_running_entry = function() {
	var headers = new Headers();
	headers.append( 'Authorization', constants.get_authorization() );
	headers.append( 'Content-Type', 'application/json' );
	var post_body = {
		'data': [
			{
				'uuid': '1bbd6745-b2c3-436b-9b2f-ccd4cdd6aea6',
				'description': 'TEST2',
				'date': '2020-08-22T10:30:26+0000',
				'duration': null,
				'assignment': {
					'person_id': 7778,
					'project_id': 120226,
					'activity_id': 15459,
					'task_id': 422056
				}
			}
		]
	};
	post_body = JSON.stringify( post_body );
	var requestOptions = {
		method: 'POST',
		headers: headers,
		redirect: 'follow',
		body: post_body
	};
	var storage = {};
	fetch(
		'https://new.costlocker.com/api-public/v2/timeentries/',
		requestOptions
	).then(
		response => {
			// save response headers into storage
			storage = response;
			return response;
		}
	).then(
		response => {
			// parse response text
			return response.text();
		}
	).then(
		result => {
			console.log( 'storage: ' + typeof storage ); console.log( storage );
			console.log( 'result: ' + typeof result ); console.log( result );
		}
	).catch(
		error => {
			console.log( 'error: ' + typeof error ); console.log( error );
		}
	);
}

export default new Api_requests;
