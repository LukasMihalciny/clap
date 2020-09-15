'use strict';

import constants from './constants.js';
import prepare_request_data from './prepare_request_data.js';

function Api_requests() {
	this.response = {};
	this.result = {};
}
Api_requests.prototype.set_response = function( response ) {
	this.response = response;
}
Api_requests.prototype.get_response_status_code = function() {
	return this.response.status;
}

Api_requests.prototype.fetch_promise = function( url, requestOptions ) {
	return fetch(
		url,
		requestOptions
	).then(
		response => {
			this.set_response( response );
			return response;
		}
	).then(
		response => {
			// parse response text
			return response.text();
		}
	).then(
		result => {
			return result;
		}
	).catch(
		error => {
			console.log( 'error: ' + typeof error ); console.log( error );
		}
	);
}

Api_requests.prototype.user_detail_promise = function() {
	var headers = new Headers();
	headers.append( 'Authorization', constants.get_authorization() );
	var requestOptions = {
		method: 'GET',
		headers: headers,
		redirect: 'follow'
	};
	var url = 'https://new.costlocker.com/api-public/v2/me';
	return this.fetch_promise( url, requestOptions );
}

Api_requests.prototype.get_assignments_promise = function() {
	var headers = new Headers();
	headers.append( 'Authorization', constants.get_authorization() );
	headers.append( 'Content-Type', 'application/json' );
	var post_body = prepare_request_data.getting_cl_data();
	var requestOptions = {
		method: 'POST',
		headers: headers,
		redirect: 'follow',
		body: post_body
	};
	var url = 'https://new.costlocker.com/api-public/v1/';
	return this.fetch_promise( url, requestOptions );
}

Api_requests.prototype.set_running_entry_promise = function() {
	var headers = new Headers();
	headers.append( 'Authorization', constants.get_authorization() );
	headers.append( 'Content-Type', 'application/json' );
	var post_body = prepare_request_data.setting_entry();
	var requestOptions = {
		method: 'POST',
		headers: headers,
		redirect: 'follow',
		body: post_body
	};
	var url = 'https://new.costlocker.com/api-public/v2/timeentries/';
	return this.fetch_promise( url, requestOptions );
}

Api_requests.prototype.stop_running_entry_promise = function() {
	var headers = new Headers();
	headers.append( 'Authorization', constants.get_authorization() );
	headers.append( 'Content-Type', 'application/json' );
	var post_body = prepare_request_data.stopping_entry();
	var requestOptions = {
		method: 'POST',
		headers: headers,
		redirect: 'follow',
		body: post_body
	};
	var url = 'https://new.costlocker.com/api-public/v2/timeentries/';
	return this.fetch_promise( url, requestOptions );
}

Api_requests.prototype.change_running_entry_promise = function() {
	var headers = new Headers();
	headers.append( 'Authorization', constants.get_authorization() );
	headers.append( 'Content-Type', 'application/json' );
	var post_body = prepare_request_data.changing_entry();
	var requestOptions = {
		method: 'POST',
		headers: headers,
		redirect: 'follow',
		body: post_body
	};
	var url = 'https://new.costlocker.com/api-public/v2/timeentries/';
	return this.fetch_promise( url, requestOptions );
}

Api_requests.prototype.corona_cases_api_promise = function() {
	var headers = new Headers();
	headers.append( 'Content-Type', 'application/json' );
	var requestOptions = {
		method: 'GET',
		headers: headers,
		redirect: 'follow'
	};
	var url = 'https://api.covid19api.com/summary';
	return this.fetch_promise( url, requestOptions );
}

export default new Api_requests;
