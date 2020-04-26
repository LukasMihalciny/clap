'use strict';

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
				// run success
				constants.user = JSON.parse( result );
				login_feedback.in();
			} else {
				// display error
				login_feedback.out();
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

/* init
**************************************************************************/
var api_requests = new Api_requests;
