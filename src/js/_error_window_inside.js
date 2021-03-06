'use strict';

const ipc = require( 'electron' ).ipcRenderer;

// receive stringyfied data in 'message' hook
ipc.on(
	'message',
	function( event, data ) {

		var error_object = JSON.parse( data );
		var output = document.getElementById( 'error_output' );
		output.innerHTML = error_object.my_message + '<br><br>' + error_object.error;

	}
);

/*
error_object expected format
var error_object = {
	my_message: 'dpwq oqwpoj dqwop',
	error: {
		pqweq: 'po qwkd pqodwqo d',
		qwe: 2324,
		pqwodq: 'dpqw opqw dopq'
	}
}
*/
