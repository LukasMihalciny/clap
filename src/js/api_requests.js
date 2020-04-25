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

	fetch(
		'https://new.costlocker.com/api-public/v2/me',
		requestOptions
	).then(
		response => response.text()
	).then(
		result => console.log( result )
	).catch(
		error => console.log( 'error', error )
	);

}

/* init
**************************************************************************/
var api_requests = new Api_requests;
